import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { extractContactKey, intakeSchema } from '@/lib/form-schema';
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

async function sendToAppsScript(params: {
  requestId: string;
  contactKey: string;
  payload: Record<string, unknown>;
}): Promise<{ operation: 'insert' | 'update'; rowNumber: number; savedAt: string } | null> {
  const url = String(process.env.GOOGLE_APPS_SCRIPT_URL ?? '').trim();
  if (!url) {
    return null;
  }

  const secret = String(
    process.env.GOOGLE_APPS_SCRIPT_SECRET ?? process.env.WEBHOOK_SECRET ?? process.env.APP_SECRET ?? ''
  ).trim();

  const commonPayload = {
    requestId: params.requestId,
    contactKey: params.contactKey,
    secret,
    webhookSecret: secret,
    webhook_secret: secret,
    ...params.payload,
    payload: params.payload
  };

  const requests: Array<() => Promise<Response>> = [
    () =>
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(secret ? { 'x-webhook-secret': secret } : {})
        },
        body: JSON.stringify(commonPayload)
      }),
    () => {
      const form = new URLSearchParams();
      Object.entries(commonPayload).forEach(([key, value]) => {
        if (value === undefined || value === null) {
          return;
        }
        if (typeof value === 'object') {
          form.set(key, JSON.stringify(value));
          return;
        }
        form.set(key, String(value));
      });
      return fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          ...(secret ? { 'x-webhook-secret': secret } : {})
        },
        body: form.toString()
      });
    }
  ];

  const errors: string[] = [];

  for (const makeRequest of requests) {
    const response = await makeRequest();
    const text = await response.text();

    if (!response.ok) {
      const snippet = text.slice(0, 220).replace(/\s+/g, ' ').trim();
      errors.push(`HTTP ${response.status}${snippet ? `: ${snippet}` : ''}`);
      continue;
    }

    let json: { ok?: boolean; operation?: 'insert' | 'update'; rowNumber?: number; savedAt?: string; error?: string } | null = null;
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }

    if (json?.ok === false) {
      errors.push(json.error ?? 'Apps Script rejected request');
      continue;
    }

    return {
      operation: json?.operation === 'update' ? 'update' : 'insert',
      rowNumber: Number(json?.rowNumber ?? 0),
      savedAt: json?.savedAt ?? new Date().toISOString()
    };
  }

  throw new Error(`Apps Script failed: ${errors.join(' | ') || 'unknown error'}`);
}

function hasSheetCredentials(): boolean {
  return Boolean(
    String(process.env.GOOGLE_CLIENT_EMAIL ?? '').trim() &&
      String(process.env.GOOGLE_PRIVATE_KEY ?? '').trim() &&
      String(process.env.GOOGLE_SHEET_ID ?? '').trim()
  );
}

export async function POST(request: Request) {
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

  if (isSpamLike([parsed.data.goal, parsed.data.skills, parsed.data.interests, parsed.data.comment ?? '', parsed.data.questions ?? ''])) {
    return NextResponse.json({ ok: false, error: 'Submission blocked by anti-spam' }, { status: 400 });
  }

  try {
    let appsScriptError = '';
    let appsScriptResult: { operation: 'insert' | 'update'; rowNumber: number; savedAt: string } | null = null;

    try {
      appsScriptResult = await sendToAppsScript({
        requestId,
        contactKey,
        payload: parsed.data
      });
    } catch (error) {
      appsScriptError = error instanceof Error ? error.message : 'Apps Script unknown error';
    }

    const result = appsScriptResult
      ? appsScriptResult
      : hasSheetCredentials()
        ? await getSheetService().upsertSubmission({
            payload: parsed.data,
            requestId,
            contactKey
          })
        : (() => {
            throw new Error(
              appsScriptError ||
                'No working save backend. Configure GOOGLE_APPS_SCRIPT_URL (+ secret) or Google Sheets API credentials.'
            );
          })();

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
