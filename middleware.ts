import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// דפים שדורשים התחברות
const protectedRoutes = [
  '/my-documents',
  '/editor',
  '/profile',
];

// דפים שמשתמש מחובר לא צריך לראות
const authRoutes = [
  '/login',
  '/register',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // בדיקה אם יש משתמש מחובר
  const currentUser = request.cookies.get('currentUser')?.value;
  const isAuthenticated = !!currentUser;

  // אם הדף דורש התחברות והמשתמש לא מחובר
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // אם המשתמש מחובר ומנסה להגיע לדפי login/register
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/my-documents', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};

