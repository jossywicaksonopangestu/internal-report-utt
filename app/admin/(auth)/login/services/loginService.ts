import {createClient} from '@/lib/supabase/client';
import {LoginSchema} from '../types';

const supabase = createClient();

interface ApiMessageResponse {
  message?: string;
}

export async function loginAdmin(values: LoginSchema) {
  const {data: authData, error: authError} =
    await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

  if (authError || !authData.user) {
    throw new Error(authError?.message || 'Login failed');
  }

  const user = authData.user;

  const {data: profile, error: profileError} = await supabase
    .from('profiles')
    .select('roles(name)')
    .eq('id', user.id)
    .single();

  if (profileError) {
    await supabase.auth.signOut();
    throw new Error('Gagal mengambil data profil admin.');
  }

  const roleRelation = Array.isArray(profile?.roles)
    ? profile.roles[0]
    : profile?.roles;
  const roleName = roleRelation?.name?.toLowerCase() ?? null;

  if (roleName !== 'admin') {
    await supabase.auth.signOut();
    throw new Error(
      'Access Denied. Akun ini tidak memiliki otorisasi sebagai Admin.',
    );
  }

  return {user, role: roleName};
}

export async function loginWithGoogleAsAdmin() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_APP_URL || window.location.origin;

  const {error} = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${baseUrl}/auth/callback?role=admin`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function requestForgotPassword(email: string) {
  const response = await fetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({email}),
  });

  const payload = (await response
    .json()
    .catch(() => null)) as ApiMessageResponse | null;

  if (!response.ok) {
    throw new Error(payload?.message || 'Failed to send reset instructions.');
  }

  return payload;
}
