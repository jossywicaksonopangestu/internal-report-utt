'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {usePathname, useRouter} from 'next/navigation';
import {
  LucideIcon,
  ChevronDown,
  ChevronRight,
  LogOut,
  AlertTriangle,
} from 'lucide-react';
import {cn} from '@/lib/classname';
import {createClient} from '@/lib/supabase/client';

export interface MenuItem {
  title: string;
  icon: LucideIcon;
  href: string;
  exact?: boolean;
  children?: MenuItem[];
}

interface SidebarProps {
  menuItems: MenuItem[];
  mobileOpen?: boolean;
  onRequestCloseMobile?: () => void;
}

interface ProfileState {
  fullname: string;
  role: string;
  avatar_url?: string | null;
}

const supabase = createClient();

export default function Sidebar({
  menuItems,
  mobileOpen = false,
  onRequestCloseMobile,
}: SidebarProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileState>({
    fullname: 'User',
    role: 'Engineer',
    avatar_url: null,
  });
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: {user},
      } = await supabase.auth.getUser();

      if (!user) {
        setProfile({fullname: 'Guest', role: 'User', avatar_url: null});
        return;
      }

      const {data} = await supabase
        .from('profiles')
        .select('fullname, roles(name), avatar_url')
        .eq('id', user.id)
        .maybeSingle();

      const roleRelation = Array.isArray(data?.roles)
        ? data.roles[0]
        : data?.roles;
      const roleName = roleRelation?.name
        ? roleRelation.name.charAt(0).toUpperCase() + roleRelation.name.slice(1)
        : 'Engineer';

      setProfile({
        fullname: data?.fullname ?? user.email ?? 'User',
        role: roleName,
        avatar_url: data?.avatar_url ?? null,
      });
    };

    loadProfile();
  }, []);

  const isSidebarVisible = isMobile ? mobileOpen : true;
  const isCollapsed = isMobile ? false : isDesktopCollapsed;

  const closeMobileSidebar = () => {
    if (isMobile) {
      onRequestCloseMobile?.();
    }
  };

  const handleMenuClick = (item: MenuItem) => {
    if (item.children) {
      setOpenMenu(openMenu === item.title ? null : item.title);
      return;
    }

    closeMobileSidebar();
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    setIsLoggingOut(false);
    router.replace('/login');
  };

  return (
    <>
      {isMobile && isSidebarVisible && (
        <div
          className="fixed inset-0 z-40 bg-black/45 transition-opacity duration-300"
          onClick={closeMobileSidebar}
        />
      )}

      <aside
        className={cn(
          'h-screen bg-[#6B70B3] text-white transition-all duration-300 flex flex-col shadow-xl z-50 shrink-0 fixed md:relative top-0 left-0',
          isMobile
            ? isSidebarVisible
              ? 'translate-x-0 w-70'
              : '-translate-x-full w-70'
            : isCollapsed
              ? 'translate-x-0 w-22.5'
              : 'translate-x-0 w-[320px]',
        )}
      >
        <button
          type="button"
          onClick={() => setIsDesktopCollapsed((prev) => !prev)}
          className="hidden md:flex absolute -right-14 top-2 w-12 h-12 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-all group z-50 cursor-pointer border border-white/10 shadow-lg"
          aria-label="Toggle sidebar"
        >
          <div className="grid grid-cols-2 gap-1.5">
            <div className="w-1.75 h-1.75 rounded-full border-2 border-white/80 group-hover:border-white transition-colors" />
            <div className="w-1.75 h-1.75 rounded-full border-2 border-white/80 group-hover:border-white transition-colors" />
            <div className="w-1.75 h-1.75 rounded-full border-2 border-white/80 group-hover:border-white transition-colors" />
            <div className="w-1.75 h-1.75 rounded-full border-2 border-white/80 group-hover:border-white transition-colors" />
          </div>
        </button>

        <div className="px-5 pt-5 pb-4 border-b border-white/10">
          <div
            className={cn(
              'flex flex-col items-center justify-center transition-all duration-300',
              isCollapsed ? 'scale-90' : 'scale-100',
            )}
          >
            <div
              className={cn(
                'relative transition-all duration-300',
                isCollapsed ? 'h-9 w-9 mb-0' : 'w-61.5 h-25 mb-2.5',
              )}
            >
              <Image
                src="/utt-main-logo.svg"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>

            <h1
              className={cn(
                'font-bold text-sm text-center leading-tight tracking-wider uppercase transition-opacity duration-300 whitespace-nowrap',
                isCollapsed
                  ? 'opacity-0 w-0 h-0 hidden'
                  : 'opacity-100 w-auto h-auto block',
              )}
            >
              United Transworld Trading
            </h1>
          </div>
        </div>

        {!isCollapsed && (
          <div className="mx-3 mt-4 rounded-2xl bg-white/10 border border-white/10 px-3 py-3">
            <div className="flex items-center gap-3">
              <div className="relative overflow-hidden h-9 w-9 rounded-xl bg-[#32386E] inline-flex items-center justify-center text-sm font-bold uppercase">
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt="Avatar"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span>{profile.fullname.slice(0, 2)}</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[23px] leading-tight font-semibold text-white">
                  {profile.fullname}
                </p>
                <span className="mt-1 inline-flex rounded-md bg-[#84A9E8]/45 px-2 py-0.5 text-[11px] text-white/90">
                  {profile.role}
                </span>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 py-4 px-3 space-y-2 overflow-y-auto scrollbar-hide">
          {menuItems.map((item) => {
            const isChildActive = !!item.children?.some(
              (child) => pathname === child.href,
            );
            const isOpen = openMenu === item.title || isChildActive;

            const isActive =
              !item.children &&
              (item.exact
                ? pathname === item.href
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`));

            return (
              <div key={item.title} className="flex flex-col">
                <div
                  onClick={() => handleMenuClick(item)}
                  className={cn(
                    'relative',
                    item.children ? 'cursor-pointer' : '',
                  )}
                >
                  {item.children ? (
                    <div
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative select-none',
                        isChildActive
                          ? 'bg-[#293038]! text-white! shadow-lg font-semibold'
                          : 'hover:bg-white/10 text-white!',
                      )}
                    >
                      <div className="flex items-center justify-center min-w-6">
                        <item.icon size={22} className="text-white" />
                      </div>

                      <span
                        className={cn(
                          'whitespace-nowrap overflow-hidden text-lg transition-all duration-300 origin-left flex-1',
                          isCollapsed
                            ? 'w-0 opacity-0 scale-0'
                            : 'w-auto opacity-100 scale-100 ml-1',
                        )}
                      >
                        {item.title}
                      </span>

                      {!isCollapsed && (
                        <div className="transition-transform duration-200">
                          {isOpen ? (
                            <ChevronDown size={18} className="text-white" />
                          ) : (
                            <ChevronRight size={18} className="text-white" />
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={closeMobileSidebar}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative',
                        isActive
                          ? 'bg-[#293038]! text-white! shadow-lg font-semibold'
                          : 'hover:bg-white/10 text-white!',
                      )}
                    >
                      <div className="flex items-center justify-center min-w-6">
                        <item.icon size={22} className="text-white" />
                      </div>

                      <span
                        className={cn(
                          'whitespace-nowrap overflow-hidden text-lg transition-all duration-300 origin-left',
                          isCollapsed
                            ? 'w-0 opacity-0 scale-0'
                            : 'w-auto opacity-100 scale-100 ml-1',
                        )}
                      >
                        {item.title}
                      </span>
                    </Link>
                  )}
                </div>

                {item.children && isOpen && !isCollapsed && (
                  <div className="ml-10 mt-1 space-y-1 border-l-2 border-white/20 pl-3">
                    {item.children.map((child) => {
                      const isChildItemActive = pathname === child.href;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={closeMobileSidebar}
                          className={cn(
                            'block py-2 px-3 rounded-lg text-sm transition-colors',
                            isChildItemActive
                              ? 'bg-[#293038]! text-white! font-semibold shadow-md translate-x-1'
                              : 'text-white! hover:bg-white/10',
                          )}
                        >
                          {child.title}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="px-3 pb-4 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={() => setIsLogoutModalOpen(true)}
            className={cn(
              'w-full inline-flex items-center rounded-xl px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 transition-colors',
              isCollapsed ? 'justify-center' : 'justify-start gap-3',
            )}
          >
            <LogOut size={18} />
            {!isCollapsed && <span className="text-base">Logout</span>}
          </button>
        </div>
      </aside>

      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-90 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-100 flex flex-col justify-center rounded-3xl bg-[#F8F8FA] p-6 shadow-[0_25px_70px_-20px_#00000066] md:p-7">
            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F8EDEF] text-[#FF3B45]">
              <AlertTriangle size={24} />
            </div>

            <h3 className="text-center font-inter text-3xl font-extrabold text-[#2A2F45]">
              Konfirmasi Logout
            </h3>
            <p className="mt-2 text-center text-base leading-relaxed text-[#737A93]">
              Apakah Anda yakin ingin keluar dari akun ini?
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="h-12 rounded-2xl border border-[#D2D7E6] bg-white text-base font-semibold text-[#5C647E]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#FF3B45] text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                <LogOut size={15} />
                {isLoggingOut ? 'Memproses...' : 'Ya, Logout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
