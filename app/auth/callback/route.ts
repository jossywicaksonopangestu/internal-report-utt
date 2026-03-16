import {NextResponse} from 'next/server';
import {createClient} from '@/lib/supabase/server';

type RoleIntent = 'admin' | 'user';

function resolveRoleIntent(value: string | null): RoleIntent {
  return value === 'admin' ? 'admin' : 'user';
}

function withAuthError(
  origin: string,
  roleIntent: RoleIntent,
  reason: string,
  detail?: string,
) {
  const loginPath = roleIntent === 'admin' ? '/admin/login' : '/login';
  const target = new URL(loginPath, origin);

  target.searchParams.set('authError', reason);
  if (detail) {
    target.searchParams.set('authMessage', detail);
  }

  return target;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const roleIntent = resolveRoleIntent(requestUrl.searchParams.get('role'));
  const code = requestUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(
      withAuthError(
        requestUrl.origin,
        roleIntent,
        'missing_code',
        'Missing OAuth code.',
      ),
    );
  }

  const supabase = await createClient();
  const {error} = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      withAuthError(
        requestUrl.origin,
        roleIntent,
        'exchange_failed',
        error.message,
      ),
    );
  }

  const syncUrl = new URL('/auth/sync', requestUrl.origin);
  syncUrl.searchParams.set('role', roleIntent);

  return NextResponse.redirect(syncUrl);
}
