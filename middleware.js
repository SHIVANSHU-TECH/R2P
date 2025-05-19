// src/middleware.js
import { NextResponse } from 'next/server';
import { adminAuth } from './src/lib/firebase/admin'; // Firebase Admin SDK

export async function middleware(request) {
  const session = request.cookies.get('__session');
  try {
    if (!session?.value) throw new Error('No session found');
    await adminAuth.verifySessionCookie(session.value);
    return NextResponse.next();
  } catch (error) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
}

// ✅ Force Node.js runtime
export const config = {
  matcher: ['/dashboard/:path*', '/portfolio/publish'],
  runtime: 'nodejs',
};