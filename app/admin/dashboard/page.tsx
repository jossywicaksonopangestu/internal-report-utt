'use client';

import Image from 'next/image';
import Link from 'next/link';
import {Spin} from 'antd';
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  Circle,
  FileText,
  User2,
  Users,
} from 'lucide-react';
import {useDashboard} from './hooks/useDashboard';
import {DashboardReportStatus} from './services/dashboardService';

const DONUT_RADIUS = 34;
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;

const STATUS_META: Record<
  DashboardReportStatus,
  {
    label: string;
    color: string;
    badgeClassName: string;
  }
> = {
  ongoing: {
    label: 'Ongoing',
    color: '#3B82F6',
    badgeClassName: 'bg-[#E9F2FF] text-[#2F6FE5]',
  },
  pending: {
    label: 'Perlu Review',
    color: '#F59E0B',
    badgeClassName: 'bg-[#FFF5E4] text-[#D97706]',
  },
  approved: {
    label: 'Approved',
    color: '#22C55E',
    badgeClassName: 'bg-[#ECFDF3] text-[#15803D]',
  },
  rejected: {
    label: 'Rejected',
    color: '#EF4444',
    badgeClassName: 'bg-[#FFF1F2] text-[#DC2626]',
  },
};

function formatShortDate(value: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

function StatusBadge({status}: {status: DashboardReportStatus}) {
  const meta = STATUS_META[status];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.badgeClassName}`}
    >
      <Circle size={7} fill="currentColor" className="opacity-80" />
      {meta.label}
    </span>
  );
}

export default function DashboardPage() {
  const {dashboard, isLoading} = useDashboard();

  if (isLoading) {
    return (
      <div className="flex h-100 w-full items-center justify-center rounded-3xl bg-white/55">
        <Spin size="large" />
      </div>
    );
  }

  const donutSegments = dashboard.statusSummary.total
    ? ([
        {
          key: 'ongoing',
          value: dashboard.statusSummary.ongoing,
          color: STATUS_META.ongoing.color,
        },
        {
          key: 'approved',
          value: dashboard.statusSummary.approved,
          color: STATUS_META.approved.color,
        },
        {
          key: 'pending',
          value: dashboard.statusSummary.pending,
          color: STATUS_META.pending.color,
        },
        {
          key: 'rejected',
          value: dashboard.statusSummary.rejected,
          color: STATUS_META.rejected.color,
        },
      ] as const)
    : [];

  let segmentOffset = 0;

  return (
    <div className="mx-auto flex w-full max-w-370 flex-col gap-5 pb-6 text-[#1F2559] md:gap-6 md:pb-10">
      <section className="relative h-36 overflow-hidden rounded-[20px] shadow-xl md:h-45">
        <Image
          src="/dashboard-user-banner.svg"
          alt="Admin Dashboard Banner"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#161D63]/86 via-[#161D63]/56 to-transparent" />

        <div className="relative z-10 flex h-full flex-col justify-center gap-1.5 px-4 py-5 text-white md:px-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70 md:text-xs">
            Admin Panel
          </p>
          <h1 className="font-inter text-3xl leading-tight font-extrabold md:text-5xl">
            Monitoring Dashboard
          </h1>
          <p className="max-w-170 text-xs text-white/80 md:text-sm">
            Monitor semua MOP & Service Report. Approve atau reject pengajuan
            MOP yang masuk.
          </p>

          <Link
            href="/admin/dashboard/monitoring"
            className="mt-1 inline-flex h-11 w-fit items-center gap-2 rounded-[14px] bg-[#F59E0B]! px-4 text-sm font-semibold text-white! shadow-[0px_8px_18px_-12px_#0A0E2A] transition-colors hover:bg-[#E08E0A]!"
          >
            <AlertTriangle size={14} />
            {dashboard.statusSummary.pending} MOP Perlu Review
          </Link>
        </div>
      </section>

      <section className="rounded-[20px] bg-[#F3F4FF] p-4 shadow-lg md:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative flex h-22.5 w-22.5 items-center justify-center">
              <svg
                viewBox="0 0 80 80"
                className="absolute inset-0 h-full w-full -rotate-90"
                aria-hidden="true"
              >
                <circle
                  cx="40"
                  cy="40"
                  r={DONUT_RADIUS}
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="12"
                />
                {donutSegments.map((segment) => {
                  const segmentLength =
                    (segment.value / dashboard.statusSummary.total) *
                    DONUT_CIRCUMFERENCE;
                  const currentOffset = segmentOffset;
                  segmentOffset += segmentLength;

                  if (segmentLength <= 0) {
                    return null;
                  }

                  return (
                    <circle
                      key={segment.key}
                      cx="40"
                      cy="40"
                      r={DONUT_RADIUS}
                      fill="none"
                      stroke={segment.color}
                      strokeWidth="12"
                      strokeDasharray={`${segmentLength} ${DONUT_CIRCUMFERENCE}`}
                      strokeDashoffset={-currentOffset}
                      strokeLinecap="butt"
                    />
                  );
                })}
              </svg>

              <div className="relative z-10 flex h-[calc(100%-16px)] w-[calc(100%-16px)] flex-col items-center justify-center rounded-full bg-[#F3F4FF]">
                <span className="text-4xl leading-none font-bold">
                  {dashboard.statusSummary.total}
                </span>
                <span className="text-[10px] text-[#6B7198]">Total MOP</span>
              </div>
            </div>

            <div className="grid grid-flow-col grid-rows-2 gap-x-6 gap-y-2.5 md:min-w-90 md:gap-x-10">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#3B82F6]" />
                <div>
                  <p className="text-xs text-[#8C92B3]">Ongoing</p>
                  <p className="text-3xl leading-none font-bold">
                    {dashboard.statusSummary.ongoing}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
                <div>
                  <p className="text-xs text-[#8C92B3]">Rejected</p>
                  <p className="text-3xl leading-none font-bold">
                    {dashboard.statusSummary.rejected}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
                <div>
                  <p className="text-xs text-[#8C92B3]">Perlu Review</p>
                  <p className="text-3xl leading-none font-bold">
                    {dashboard.statusSummary.pending}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#22C55E]" />
                <div>
                  <p className="text-xs text-[#8C92B3]">Approved</p>
                  <p className="text-3xl leading-none font-bold">
                    {dashboard.statusSummary.approved}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#8B5CF6]" />
                <div>
                  <p className="text-xs text-[#8C92B3]">Engineer</p>
                  <p className="text-3xl leading-none font-bold">
                    {dashboard.engineerCount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <article className="rounded-[20px] bg-[#F9FAFC] p-4 shadow-lg md:p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-inter text-[14px] font-extrabold text-[#272D66] md:text-[16px]">
              Menunggu Approval{' '}
              <span className="ml-1 rounded-full bg-[#F59E0B] px-2 py-0.5 text-[11px] text-white">
                {dashboard.statusSummary.pending}
              </span>
            </h2>
            <Link
              href="/admin/dashboard/monitoring"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#5D63A8] transition-colors hover:text-[#38408F]"
            >
              Lihat Semua
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-2.5">
            {dashboard.pendingItems.length === 0 && (
              <div className="rounded-xl border border-dashed border-[#D6D9EF] bg-white px-4 py-8 text-center text-sm text-[#868CB0]">
                Tidak ada MOP yang menunggu approval.
              </div>
            )}

            {dashboard.pendingItems.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-[#F3DBA8] bg-[#FFF9E9] px-3.5 py-3"
              >
                <p className="truncate text-sm font-bold text-[#2A3161] md:text-base">
                  {item.maintenanceName}
                </p>
                <p className="mt-0.5 text-xs text-[#8D93B4]">
                  {item.picName} - {item.serviceReportCount} service report
                </p>
                <p className="mt-1 inline-flex items-center gap-1 text-xs text-[#D97706]">
                  <CalendarDays size={12} />
                  Diajukan: {formatShortDate(item.submittedAt)}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[20px] bg-[#F9FAFC] p-4 shadow-lg md:p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-inter text-[14px] font-extrabold text-[#272D66] md:text-[16px]">
              Aktivitas MOP Terbaru
            </h2>
            <Link
              href="/admin/dashboard/monitoring"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#5D63A8] transition-colors hover:text-[#38408F]"
            >
              Lihat Semua
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-2.5">
            {dashboard.latestActivity.length === 0 && (
              <div className="rounded-xl border border-dashed border-[#D6D9EF] bg-white px-4 py-8 text-center text-sm text-[#868CB0]">
                Belum ada aktivitas MOP.
              </div>
            )}

            {dashboard.latestActivity.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-xl bg-[#F1F2F5] px-3 py-3"
              >
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#6970B5]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-[#252C66] md:text-base">
                    {item.maintenanceName}
                  </p>
                  <p className="truncate text-xs text-[#8B90AF]">
                    {item.picName} - {formatShortDate(item.updatedAt)}
                  </p>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </article>
      </section>

      <article className="overflow-hidden rounded-[20px] bg-[#F9FAFC] p-4 shadow-lg md:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="font-inter text-[18px] font-extrabold text-[#272D66] md:text-[24px]">
              Sistem Laporan Preventive Maintenance Data Center
            </h3>
            <p className="mt-2 max-w-175 text-xs leading-relaxed text-[#7B81A6] md:text-sm">
              Website ini memudahkan engineer dalam proses pencatatan,
              pengunggahan dokumentasi, serta pembuatan laporan preventive
              maintenance secara otomatis sehingga meningkatkan efisiensi dan
              akurasi data.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#8B90AF] md:text-sm">
              <span className="inline-flex items-center gap-1.5">
                <FileText size={14} />
                {dashboard.statusSummary.total} Total MOP
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users size={14} />
                {dashboard.engineerCount} Engineer
              </span>
              <span className="inline-flex items-center gap-1.5">
                <User2 size={14} />
                {dashboard.serviceReportCount} Service Report
              </span>
            </div>
          </div>

          <div className="relative h-28 w-full overflow-hidden rounded-xl md:h-30 md:w-76">
            <Image
              src="/sample-dashboard-image2.svg"
              alt="Dashboard Illustration"
              fill
              sizes="40vw"
              className="object-cover"
            />
          </div>
        </div>
      </article>
    </div>
  );
}
