import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refreshing the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Protect private routes: redirect unauthenticated users to /auth
  const isPrivateRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/profile');
  if (!user && isPrivateRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth';
    url.searchParams.set('mode', 'login');
    return NextResponse.redirect(url);
  }

  // DO NOT redirect logged-in users from /auth - let them choose to login/signup
  // (They may be trying to switch accounts)

  return supabaseResponse;
}
