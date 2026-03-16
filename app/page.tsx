'use client';

import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {Spin} from 'antd';
import {createClient} from '@/lib/supabase/client';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const checkUserSession = async () => {
      const supabase = createClient();

      try {
        const {
          data: {user},
        } = await supabase.auth.getUser();

        if (!user) {
          router.replace('/login');
          return;
        }

        type Profile = {
          roles: {name: string} | {name: string}[] | null;
        };

        const {data: profile} = await supabase
          .from('profiles')
          .select('roles(name)')
          .eq('id', user.id)
          .single<Profile>();

        const roleName = Array.isArray(profile?.roles)
          ? (
              profile?.roles[0] as {name: string} | undefined
            )?.name?.toLowerCase()
          : (profile?.roles as {name: string} | undefined)?.name?.toLowerCase();

        if (roleName === 'admin') {
          router.replace('/admin/dashboard');
        } else {
          router.replace('/dashboard');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.replace('/login');
      }
    };

    checkUserSession();
  }, [router]);

  return (
    <div className="min-h-screen w-full bg-brand-gradient flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spin size="large" />
        <p className="text-white font-medium text-lg animate-pulse">
          Authenticating...
        </p>
      </div>
    </div>
  );
}
