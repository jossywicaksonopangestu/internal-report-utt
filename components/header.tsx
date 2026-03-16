'use client';

import {Dropdown, MenuProps, Avatar} from 'antd';
import {UserOutlined, LogoutOutlined} from '@ant-design/icons';
import {User} from 'lucide-react';
import Link from 'next/link';
import {createClient} from '@/lib/supabase/client';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';

export default function Header(props: {logoutRedirectUri: string}) {
  const router = useRouter();
  const supabase = createClient();
  const [displayName, setDisplayName] = useState('User');
  const [displayRole, setDisplayRole] = useState('User');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: {user},
      } = await supabase.auth.getUser();

      if (!user) {
        setDisplayName('Guest');
        setDisplayRole('Unauthenticated');
        return;
      }

      const {data: profile} = await supabase
        .from('profiles')
        .select('fullname, roles(name), avatar_url')
        .eq('id', user.id)
        .maybeSingle();

      const roleRelation = Array.isArray(profile?.roles)
        ? profile.roles[0]
        : profile?.roles;

      const roleName = roleRelation?.name
        ? roleRelation.name.charAt(0).toUpperCase() + roleRelation.name.slice(1)
        : 'User';

      setDisplayName(profile?.fullname || user.email || 'User');
      setDisplayRole(roleName);
      setAvatarUrl(profile?.avatar_url || null);
    };

    loadProfile();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace(props.logoutRedirectUri ?? '/login');
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Link href="/profile" className="flex items-center gap-2 px-2 py-1">
          <User size={16} />
          <span>View Profile</span>
        </Link>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: '2',
      label: (
        <div
          onClick={handleLogout}
          className="flex items-center gap-2 px-2 py-1 text-red-500 cursor-pointer"
        >
          <LogoutOutlined />
          <span>Logout</span>
        </div>
      ),
    },
  ];

  return (
    <header className="h-16 flex items-center justify-end px-8 bg-transparent">
      <Dropdown menu={{items}} placement="bottomRight" arrow>
        <div className="cursor-pointer flex items-center gap-3 hover:bg-white/10 p-2 rounded-lg transition-colors">
          <div className="text-right hidden md:block">
            <p className="text-white text-sm font-semibold">{displayName}</p>
            <p className="text-white/70 text-xs">{displayRole}</p>
          </div>
          <Avatar
            size="large"
            src={avatarUrl}
            icon={!avatarUrl ? <UserOutlined /> : undefined}
            className="bg-white text-[#6168FF] flex items-center justify-center"
          />
        </div>
      </Dropdown>
    </header>
  );
}
