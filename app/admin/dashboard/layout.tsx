'use client';

import Sidebar, {MenuItem} from '@/components/sidebar';
import {LayoutDashboard, ClipboardCheck, Menu} from 'lucide-react';
import {useState} from 'react';
import Image from 'next/image';

const adminMenuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin/dashboard',
    exact: true,
  },
  {
    title: 'Monitoring',
    icon: ClipboardCheck,
    href: '/admin/dashboard/monitoring',
  },
  {
    title: 'Settings',
    icon: ClipboardCheck,
    href: '/profile',
  },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-brand-gradient overflow-hidden">
      <Sidebar
        menuItems={adminMenuItems}
        mobileOpen={mobileSidebarOpen}
        onRequestCloseMobile={() => setMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col h-full min-w-0">
        <header className="md:hidden h-15 px-4 flex items-center justify-between bg-[#1D2269] text-white border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="relative h-6 w-10">
              <Image
                src="/utt-main-logo.svg"
                alt="UTT Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-lg font-semibold">UTT Internal Report</span>
          </div>

          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="h-10 w-10 rounded-xl bg-white/10 border border-white/15 inline-flex items-center justify-center"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 md:p-8 scroll-smooth w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
