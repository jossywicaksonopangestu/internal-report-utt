import {createServerClient} from '@supabase/ssr';
import {NextRequest, NextResponse} from 'next/server';

async function getAuthState(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
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
          cookiesToSet.forEach(({name, value}) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({name, value, options}) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    return {response, isAuthenticated: false, roleName: null};
  }

  const {data: profile, error} = await supabase
    .from('profiles')
    .select('roles(name)')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    return {response, isAuthenticated: true, roleName: null};
  }

  const roleRelation = Array.isArray(profile?.roles)
    ? profile.roles[0]
    : profile?.roles;
  const roleName = roleRelation?.name?.toLowerCase() ?? null;

  return {response, isAuthenticated: true, roleName};
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isAdminPath = pathname.startsWith('/admin');
  const isUserPath = pathname.startsWith('/dashboard');

  if (!isAdminPath && !isUserPath) {
    return NextResponse.next();
  }

  const authState = await getAuthState(request);
  const isAdmin = authState.roleName === 'admin';

  if (pathname === '/admin/login') {
    if (authState.isAuthenticated && isAdmin) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/admin/dashboard';
      return NextResponse.redirect(redirectUrl);
    }

    if (authState.isAuthenticated && !isAdmin) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/login';
      return NextResponse.redirect(redirectUrl);
    }

    return authState.response;
  }

  if (pathname === '/login') {
    if (authState.isAuthenticated && isAdmin) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/admin/dashboard';
      return NextResponse.redirect(redirectUrl);
    }

    if (authState.isAuthenticated && !isAdmin) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/dashboard';
      return NextResponse.redirect(redirectUrl);
    }

    return authState.response;
  }

  if (isAdminPath && (!authState.isAuthenticated || !isAdmin)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/admin/login';
    return NextResponse.redirect(redirectUrl);
  }

  if (isUserPath && (!authState.isAuthenticated || isAdmin)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/login';
    return NextResponse.redirect(redirectUrl);
  }

  return authState.response;
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/login'],
};
