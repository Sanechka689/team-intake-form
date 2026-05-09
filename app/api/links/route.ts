import { NextResponse } from 'next/server';
import { isAccessTokenValid } from '@/lib/security/access';

export async function GET(request: Request) {
  const token = request.headers.get('x-access-token');

  if (!isAccessTokenValid(token)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    data: {
      folder: process.env.LINK_FOLDER ?? '#',
      cheatsheet: process.env.LINK_CHEATSHEET ?? '#',
      table: process.env.LINK_TABLE ?? '#',
      instruction: process.env.LINK_INSTRUCTION ?? '#',
      askQuestion: process.env.LINK_QUESTIONS ?? '#'
    }
  });
}
