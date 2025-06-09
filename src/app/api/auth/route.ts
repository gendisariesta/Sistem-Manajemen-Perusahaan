// app/api/me/route.ts
import { NextResponse } from 'next/server';
import { getUserFromSession } from '@/lib/auth';

export async function GET() {
  const user = await getUserFromSession();

  if (!user) {
    return NextResponse.json({ status: 401, error: 'Unauthorized' });
  }

  return NextResponse.json({ status: 200, user });
}
