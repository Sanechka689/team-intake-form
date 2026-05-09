import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { extractContactKey, intakeSchema } from '@/lib/form-schema';
import { isAccessTokenValid } from '@/lib/security/access';
import { getIdempotentResponse, saveIdempotentResponse } from '@/lib/security/idempotency';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { isSpamLike } from '@/lib/security/spam';
import { getSheetService } from '@/lib/sheets/service';

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() ?? 'unknown';
  }
  return 'unknown';
}

export async function POST(request: Request) {
  const token = request.headers.get('x-access-token');
  if (!isAccessTokenValid(token)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const requestId = request.headers.get('x-idempotency-key') ?? randomUUID();
  const cached = getIdempotentResponse(requestId);
  if (cached) {
    return NextResponse.json(cached);
  }

  let payloadRaw: unknown;
  try {
    payloadRaw = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = intakeSchema.safeParse(payloadRaw);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
  }

  if (parsed.data.website && parsed.data.website.trim()) {
    return NextResponse.json({ ok: false, error: 'Spam detected' }, { status: 400 });
  }

  const contactKey = extractContactKey(parsed.data.name_contact);
  const ip = getClientIp(request);
  const rate = checkRateLimit(`${ip}:${contactKey}`);
  if (!rate.ok) {
    return NextResponse.json(
      { ok: false, error: 'Too many attempts. Try later.', retryAfterSec: rate.retryAfterSec },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfterSec) } }
    );
  }

  if (
    isSpamLike([
      parsed.data.goal,
      parsed.data.skills,
      parsed.data.interests,
      parsed.data.comment ?? '',
      parsed.data.questions ?? ''
    ])
  ) {
    return NextResponse.json({ ok: false, error: 'Submission blocked by anti-spam' }, { status: 400 });
  }

  try {
    const result = await getSheetService().upsertSubmission({
      payload: parsed.data,
      requestId,
      contactKey
    });

    const responsePayload = {
      ok: true,
      operation: result.operation,
      rowNumber: result.rowNumber,
      requestId,
      savedAt: result.savedAt
    };

    saveIdempotentResponse(requestId, responsePayload);
    return NextResponse.json(responsePayload);
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Failed to save submission',
        requestId,
        details: error instanceof Error ? error.message : 'unknown_error'
      },
      { status: 500 }
    );
  }
}
