import Link from 'next/link';
import dayjs from 'dayjs';
import {ArrowRight} from 'lucide-react';
import {DashboardData} from '../types';
import {getStatusBadge} from '../services/dashboardService';

interface DashboardLatestMopSectionProps {
  dashboard: DashboardData;
  sectionTitleClassName: string;
}

export function DashboardLatestMopSection({
  dashboard,
  sectionTitleClassName,
}: DashboardLatestMopSectionProps) {
  return (
    <article className="rounded-[20px] bg-[#F9FAFC] p-4 shadow-lg md:p-6 lg:col-span-2">
      <div className="mb-4 flex items-center justify-between">
        <h2 className={sectionTitleClassName}>MOP Terbaru</h2>
        <Link
          href="/dashboard/reports"
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#5D63A8] transition-colors hover:text-[#38408F]"
        >
          Lihat Semua
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="space-y-3">
        {dashboard.latestMops.length === 0 && (
          <div className="rounded-xl border border-dashed border-[#D6D9EF] bg-white px-4 py-8 text-center text-sm text-[#868CB0]">
            Belum ada data MOP.
          </div>
        )}

        {dashboard.latestMops.map((item) => {
          const badge = getStatusBadge(item.status);

          return (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-xl bg-[#F1F2F5] px-3 py-3.5 transition-transform hover:scale-[1.01] md:gap-4 md:px-4"
            >
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#6970B5]" />

              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-bold text-[#252C66] md:text-lg">
                  {item.title}
                </p>
                <p className="truncate text-xs text-[#8B90AF] md:text-sm">
                  {dayjs(item.workDate).format('DD MMM YYYY')} - {item.spec}
                </p>
              </div>

              <div className="hidden md:flex">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${badge.className}`}
                >
                  {badge.label}
                </span>
              </div>

              <ArrowRight size={16} className="text-[#B2B7D8] md:hidden" />
            </div>
          );
        })}
      </div>
    </article>
  );
}
