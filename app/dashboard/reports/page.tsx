'use client';

import {Input, Spin} from 'antd';
import {useRouter} from 'next/navigation';
import {
  CalendarDays,
  ChevronRight,
  FileText,
  Plus,
  Search,
  StickyNote,
} from 'lucide-react';
import {useReports} from './hooks/useReports';
import {ReportStatus, STATUS_META} from './types';

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

function formatDateRange(startDate: string, endDate: string): string {
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

function StatCircle({
  label,
  value,
  status,
  isActive,
  onClick,
}: {
  label: string;
  value: number;
  status: 'total' | ReportStatus;
  isActive: boolean;
  onClick: () => void;
}) {
  const colorClassByStatus = {
    total: 'bg-[#444A7D] ring-4 ring-[#2D3161]/40',
    ongoing: 'bg-[#4D73D9] ring-2 ring-[#3C66D4]',
    pending: 'bg-[#C57D4F] ring-2 ring-[#B16B3F]',
    approved: 'bg-[#2B9A8C] ring-2 ring-[#23887C]',
    rejected: 'bg-[#AF4676] ring-2 ring-[#9E3A67]',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-w-13 cursor-pointer flex-col items-center gap-2"
    >
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-full text-4.5 font-bold text-white shadow-lg transition-all ${colorClassByStatus[status]} ${isActive ? 'scale-[1.03] ring-4 ring-[#C7D2FA]' : 'opacity-85 hover:opacity-100'}`}
      >
        {value}
      </div>
      <p
        className={`text-center text-xs ${isActive ? 'font-semibold text-[#2F376A]' : 'text-[#8A92B4]'}`}
      >
        {label}
      </p>
    </button>
  );
}

function StatusBadge({status}: {status: ReportStatus}) {
  const statusMeta = STATUS_META[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusMeta.badgeClassName}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${statusMeta.dotClassName}`} />
      {statusMeta.label}
    </span>
  );
}

export default function UserReportsPage() {
  const router = useRouter();
  const {
    filteredReports,
    stats,
    isLoading,
    searchKeyword,
    setSearchKeyword,
    selectedStatus,
    setSelectedStatus,
  } = useReports();

  return (
    <div className="mx-auto w-full max-w-370 pb-6 text-[#2B315F] md:pb-10">
      <section className="overflow-hidden rounded-[22px] bg-white p-3 shadow-[0px_16px_35px_-22px_#090D2B] md:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-inter text-3xl leading-tight font-extrabold md:text-4xl">
              MOP Reports
            </h1>
            <p className="mt-1 text-xs text-[#7F87AA] md:text-sm">
              Kelola semua Method of Procedure (MOP) Anda
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push('/dashboard/reports/create')}
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-[14px] bg-[#3F467E] px-3.5 text-sm font-semibold text-white shadow-[0px_8px_18px_-12px_#0A0E2A] transition-colors hover:bg-[#343A6D] md:h-11 md:px-4"
          >
            <Plus size={14} />
            Buat MOP Baru
          </button>
        </div>

        <div className="mt-4 rounded-2xl border border-[#E1E6F8] bg-[#F6F8FF] p-3 md:mt-5 md:p-4">
          <div className="grid grid-cols-5 gap-2 md:gap-4">
            <StatCircle
              label="Total"
              value={stats.total}
              status="total"
              isActive={selectedStatus === 'all'}
              onClick={() => setSelectedStatus('all')}
            />
            <StatCircle
              label="Ongoing"
              value={stats.ongoing}
              status="ongoing"
              isActive={selectedStatus === 'ongoing'}
              onClick={() => setSelectedStatus('ongoing')}
            />
            <StatCircle
              label="Pending"
              value={stats.pending}
              status="pending"
              isActive={selectedStatus === 'pending'}
              onClick={() => setSelectedStatus('pending')}
            />
            <StatCircle
              label="Approved"
              value={stats.approved}
              status="approved"
              isActive={selectedStatus === 'approved'}
              onClick={() => setSelectedStatus('approved')}
            />
            <StatCircle
              label="Rejected"
              value={stats.rejected}
              status="rejected"
              isActive={selectedStatus === 'rejected'}
              onClick={() => setSelectedStatus('rejected')}
            />
          </div>
        </div>

        <div className="mt-4 md:mt-5">
          <Input
            value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.target.value)}
            allowClear
            prefix={<Search size={16} className="text-[#A0A8D2]" />}
            placeholder="Cari nama MOP atau file..."
            className="h-11 max-w-130 rounded-4xl border-none bg-[#EEF0FF] px-1 text-sm text-[#2E356C] shadow-[0px_10px_16px_-14px_#0C1238]"
          />
        </div>

        <div className="mt-4 space-y-3 md:mt-5 md:space-y-2.5">
          {isLoading && (
            <div className="flex h-40 items-center justify-center rounded-2xl bg-[#F3F6FF]">
              <Spin size="large" />
            </div>
          )}

          {!isLoading && filteredReports.length === 0 && (
            <div className="rounded-2xl bg-white/90 px-5 py-10 text-center text-sm text-[#616A95]">
              Tidak ada MOP report yang sesuai dengan pencarian.
            </div>
          )}

          {!isLoading &&
            filteredReports.map((report) => (
              <article
                key={report.id}
                onClick={() => router.push(`/dashboard/reports/${report.id}`)}
                className="group cursor-pointer rounded-2xl bg-[#F3F5FF] px-3 py-3.5 text-[#232B62] shadow-[0px_9px_18px_-14px_#0C1238] transition-transform hover:scale-[1.004] md:px-4 md:py-4"
              >
                <div className="flex items-start gap-2 md:items-center md:justify-between">
                  <h2 className="line-clamp-1 min-w-0 flex-1 font-inter text-xl leading-tight font-extrabold md:text-2xl">
                    {report.maintenanceName}
                  </h2>
                  <div className="inline-flex items-center gap-1.5">
                    <StatusBadge status={report.status} />
                    <ChevronRight
                      size={14}
                      className="mt-0.5 text-[#B2B8D7] transition-transform group-hover:translate-x-0.5"
                    />
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#8A92B4]">
                  <span className="inline-flex items-center gap-1.5">
                    <FileText size={13} />
                    {report.mainFileName}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays size={13} />
                    {formatDateRange(report.startDate, report.endDate)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <StickyNote size={13} />
                    {report.serviceReportCount} service report
                  </span>
                </div>

                {report.status === 'approved' && report.adminNote && (
                  <div className="mt-3 rounded-xl border border-[#B8E9D4] bg-[#E8FFF4] px-3 py-2 text-sm text-[#138A61]">
                    Catatan Admin: {report.adminNote}
                  </div>
                )}

                {report.status === 'rejected' && report.revisionNote && (
                  <div className="mt-3 rounded-xl border border-[#F5C4C4] bg-[#FFF1F1] px-3 py-2 text-sm text-[#D9363E]">
                    Alasan Penolakan: {report.revisionNote}
                  </div>
                )}
              </article>
            ))}
        </div>
      </section>
    </div>
  );
}
