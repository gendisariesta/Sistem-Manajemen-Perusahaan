import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(
      new URL(`/login?callback=${encodeURIComponent(req.nextUrl.pathname)}`, req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/divisions/:path*',
    '/employees/:path*',
    '/permission/:path*',
    '/attendance/:path*',
    '/reports/:path*',
    '/kpi/:path*',
  ],
};
