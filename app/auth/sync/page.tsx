'use client';

import {Spin} from 'antd';
import {useRouter} from 'next/navigation';
import {useEffect, useRef, useState} from 'react';
import {createClient} from '@/lib/supabase/client';

type RoleIntent = 'admin' | 'user';

interface SyncProfileResponse {
  roleName?: string | null;
  message?: string;
}

function withAuthError(path: string, reason: string, detail?: string) {
  const params = new URLSearchParams();
  params.set('authError', reason);

  if (detail) {
    params.set('authMessage', detail);
  }

  return `${path}?${params.toString()}`;
}

export default function AuthSyncPage() {
  const router = useRouter();
  const hasHandled = useRef(false);
  const [statusText, setStatusText] = useState('Menyinkronkan sesi Google...');

  useEffect(() => {
    if (hasHandled.current) {
      return;
    }

    hasHandled.current = true;

    const syncAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const roleIntent = (params.get('role') as RoleIntent | null) || 'user';
      const loginPath = roleIntent === 'admin' ? '/admin/login' : '/login';

      const supabase = createClient();

      const {
        data: {session},
      } = await supabase.auth.getSession();

      const {
        data: {user},
      } = await supabase.auth.getUser();

      if (!session?.access_token || !user) {
        router.replace(
          withAuthError(
            loginPath,
            'session_not_found',
            'Google session was not created.',
          ),
        );
        return;
      }

      const syncResponse = await fetch('/api/auth/sync-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token
            ? {Authorization: `Bearer ${session.access_token}`}
            : {}),
        },
        body: JSON.stringify({roleIntent}),
      });

      const syncPayload = (await syncResponse
        .json()
        .catch(() => null)) as SyncProfileResponse | null;

      if (!syncResponse.ok) {
        await supabase.auth.signOut();
        router.replace(
          withAuthError(
            loginPath,
            'sync_failed',
            syncPayload?.message || 'Failed to sync profile.',
          ),
        );
        return;
      }

      const roleName = syncPayload?.roleName?.toLowerCase() ?? null;
      const isAdmin = roleName === 'admin';

      if (roleIntent === 'admin' && !isAdmin) {
        await supabase.auth.signOut();
        router.replace(
          withAuthError(
            '/admin/login',
            'admin_only',
            'Akun ini tidak memiliki akses admin.',
          ),
        );
        return;
      }

      if (roleIntent === 'user' && isAdmin) {
        await supabase.auth.signOut();
        router.replace(
          withAuthError(
            '/login',
            'user_only',
            'Akun admin tidak dapat login dari portal user.',
          ),
        );
        return;
      }

      setStatusText('Berhasil, mengarahkan...');
      router.replace(isAdmin ? '/admin/dashboard' : '/dashboard');
    };

    void syncAuth();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-login-right px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
        <Spin size="large" />
        <h1 className="mt-6 text-[24px] font-bold text-[#111827]">
          Google Sign-In
        </h1>
        <p className="mt-2 text-[15px] text-[#64748B]">{statusText}</p>
      </div>
    </div>
  );
}
