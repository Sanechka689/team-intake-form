import { NextResponse } from 'next/server';
import { getAppLinks } from '@/lib/links';
import { isAccessTokenValid } from '@/lib/security/access';

export async function GET(request: Request) {
  const token = request.headers.get('x-access-token');

  if (!isAccessTokenValid(token)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    data: getAppLinks()
  });
}
