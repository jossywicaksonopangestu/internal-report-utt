import Image from 'next/image';
import Link from 'next/link';
import {Plus} from 'lucide-react';

interface DashboardBannerProps {
  userName: string;
}

export function DashboardBanner({userName}: DashboardBannerProps) {
  return (
    <section className="relative h-40 overflow-hidden rounded-[20px] shadow-xl md:h-52">
      <Image
        src="/dashboard-user-banner.svg"
        alt="User Dashboard Banner"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-r from-[#20277E]/85 via-[#20277E]/65 to-transparent" />

      <div className="relative z-10 flex h-full flex-col justify-center gap-2 px-4 py-5 text-white md:px-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70 md:text-xs">
          Selamat Datang Kembali,
        </p>
        <h1 className="max-w-75 text-2xl leading-tight font-bold md:max-w-130 md:text-5xl">
          {userName}
        </h1>
        <p className="max-w-145 text-[11px] leading-relaxed text-white/80 md:text-sm">
          Kelola MOP & Service Report preventive <br />
          maintenance data center Anda.
        </p>

        <Link
          href="/dashboard/reports/create"
          className="mt-1 inline-flex h-10 w-38.5 items-center justify-center gap-1.5 rounded-[14px] border border-white/60 bg-white text-sm font-semibold text-[#3F467E] shadow-[0px_4px_6px_-4px_#0000001A,0px_10px_15px_-3px_#0000001A] transition-transform hover:scale-[1.02]"
        >
          <Plus size={15} />
          Tambah MOP Baru
        </Link>
      </div>
    </section>
  );
}
