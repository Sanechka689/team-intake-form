import { NextResponse } from 'next/server';
import { getProjectLinks } from '@/lib/links';

export async function GET() {
  return NextResponse.json({
    ok: true,
    data: getProjectLinks()
  });
}
