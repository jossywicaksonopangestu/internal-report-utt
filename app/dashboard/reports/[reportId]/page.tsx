'use client';

import {useState} from 'react';
import Link from 'next/link';
import {useParams} from 'next/navigation';
import {
  CalendarDays,
  ChevronLeft,
  FileText,
  Loader2,
  PenLine,
  Send,
} from 'lucide-react';
import {Spin} from 'antd';
import {ReportStatus, STATUS_META} from '../types';
import {useReportDetail} from './hooks/useReportDetail';
import {DetailStatusPanel} from './types';

function formatLongDate(value: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
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

function buildStatusPanel(
  reportStatus: ReportStatus,
): DetailStatusPanel | null {
  if (reportStatus === 'pending') {
    return {
      title: 'Diajukan ke admin. Menunggu review.',
      description: 'Dokumen Anda sedang ditinjau oleh admin.',
      className: 'border-[#F1DBA7] bg-[#FFF7DF] text-[#C26B00]',
    };
  }

  if (reportStatus === 'approved') {
    return {
      title: 'MOP Disetujui',
      description: 'Dokumen dan service report telah disetujui admin.',
      className: 'border-[#B8E9D4] bg-[#E8FFF4] text-[#0D8E62]',
    };
  }

  if (reportStatus === 'rejected') {
    return {
      title: 'MOP Ditolak',
      description: 'Silakan lakukan revisi lalu ajukan ulang.',
      className: 'border-[#F5C4C4] bg-[#FFF1F1] text-[#D9363E]',
    };
  }

  return null;
}

export default function ReportDetailPage() {
  const params = useParams<{reportId: string}>();
  const reportId = params.reportId;
  const [activeModal, setActiveModal] = useState<'submit' | null>(null);

  const {report, isLoading, isSubmitting, submitToAdmin} =
    useReportDetail(reportId);

  const handleConfirmSubmit = async () => {
    await submitToAdmin();
    setActiveModal(null);
  };

  if (isLoading) {
    return (
      <div className="flex h-70 items-center justify-center rounded-3xl bg-white/20">
        <Spin size="large" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="rounded-3xl bg-white px-6 py-10 text-center text-[#3A4279]">
        Detail MOP tidak ditemukan.
      </div>
    );
  }

  const statusPanel = buildStatusPanel(report.status);
  const primaryFile = report.serviceReports[0];

  return (
    <div className="mx-auto w-full max-w-370 pb-7 md:pb-10">
      <Link
        href="/dashboard/reports"
        className="mb-3 inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-sm text-white/85 transition-colors hover:bg-white/15 hover:text-white"
      >
        <ChevronLeft size={15} />
        Kembali ke MOP List
      </Link>

      <section className="rounded-[22px] bg-[#F3F5FF] p-4 text-[#2B315F] shadow-[0px_20px_38px_-24px_#0A0E2A] md:p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="font-inter text-3xl leading-tight font-extrabold md:text-4xl">
              {report.maintenanceName}
            </h1>
            <p className="mt-1 text-sm text-[#9AA0BD]">
              Dibuat: {formatLongDate(report.createdAt)}
            </p>
          </div>

          <StatusBadge status={report.status} />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-white px-3 py-2.5">
            <p className="text-xs text-[#9AA0BD]">File MOP</p>
            <p className="mt-1 line-clamp-1 text-base font-semibold text-[#48507F]">
              {primaryFile?.fileName ?? '-'}
            </p>
          </div>

          <div className="rounded-2xl bg-white px-3 py-2.5">
            <p className="inline-flex items-center gap-1 text-xs text-[#9AA0BD]">
              <CalendarDays size={12} />
              Tanggal Mulai
            </p>
            <p className="mt-1 text-base font-semibold text-[#48507F]">
              {formatLongDate(report.startDate)}
            </p>
          </div>

          <div className="rounded-2xl bg-white px-3 py-2.5">
            <p className="inline-flex items-center gap-1 text-xs text-[#9AA0BD]">
              <CalendarDays size={12} />
              Tanggal Selesai
            </p>
            <p className="mt-1 text-base font-semibold text-[#48507F]">
              {formatLongDate(report.endDate)}
            </p>
          </div>
        </div>

        {statusPanel && (
          <div
            className={`mt-4 rounded-2xl border px-3 py-2.5 text-sm ${statusPanel.className}`}
          >
            <p className="font-semibold">{statusPanel.title}</p>
            <p className="mt-0.5">{statusPanel.description}</p>
            {report.status === 'approved' && report.adminNote && (
              <p className="mt-1.5">Catatan Admin: {report.adminNote}</p>
            )}
            {report.status === 'rejected' && report.revisionNote && (
              <p className="mt-1.5">Alasan: {report.revisionNote}</p>
            )}
          </div>
        )}

        {report.status === 'ongoing' && (
          <button
            type="button"
            onClick={() => setActiveModal('submit')}
            disabled={isSubmitting}
            className="mt-4 inline-flex h-11 items-center gap-2 rounded-2xl bg-[#08A66A] px-4 text-sm font-semibold text-white shadow-[0px_12px_22px_-14px_#066C46] transition-colors hover:bg-[#09935E] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Mengajukan...
              </>
            ) : (
              <>
                <Send size={15} />
                Ajukan ke Admin
              </>
            )}
          </button>
        )}

        {report.status === 'rejected' && (
          <Link
            href={`/dashboard/reports/edit/${report.id}`}
            className="mt-4 inline-flex h-11 items-center gap-2 rounded-2xl bg-[#3E447E] px-4 text-sm font-semibold text-white shadow-[0px_12px_22px_-14px_#282E5F] transition-colors hover:bg-[#353B70]"
          >
            <PenLine size={15} />
            Edit & Resubmit
          </Link>
        )}
      </section>

      <section className="mt-5 rounded-[22px] bg-[#F3F5FF] p-4 text-[#2B315F] shadow-[0px_20px_38px_-24px_#0A0E2A] md:p-6">
        <h2 className="font-inter text-2xl leading-tight font-extrabold md:text-3xl">
          Service Reports
        </h2>
        <p className="mt-1 text-sm text-[#9AA0BD]">
          {report.serviceReports.length} laporan progress
        </p>

        {report.serviceReports.length === 0 && (
          <div className="mt-4 rounded-2xl bg-white px-4 py-8 text-center text-sm text-[#8C94B7]">
            Belum ada service report.
          </div>
        )}

        {report.serviceReports.length > 0 && (
          <div className="mt-4 space-y-3">
            {report.serviceReports.map((serviceReport, index) => {
              const isLast = index === report.serviceReports.length - 1;

              return (
                <article
                  key={serviceReport.id}
                  className="relative rounded-2xl bg-white px-4 py-3.5"
                >
                  <div className="absolute top-6 left-3.5 flex w-4 flex-col items-center">
                    <span className="z-10 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#555D9A] text-xs font-bold text-white shadow-md">
                      {index + 1}
                    </span>
                    {!isLast && (
                      <span className="mt-1 h-16 w-px bg-[#CED3EB]" />
                    )}
                  </div>

                  <div className="ml-8">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-[#2E356C]">
                        {serviceReport.title}
                      </h3>
                      <span className="rounded-full bg-[#E7EEFF] px-2 py-0.5 text-xs font-semibold text-[#3D72E8]">
                        {formatLongDate(serviceReport.fileDate)}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-[#5D668E]">
                      {serviceReport.description}
                    </p>

                    <a
                      href={serviceReport.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-sm text-[#6872A0] hover:text-[#2F3A7E]"
                    >
                      <FileText size={14} />
                      {serviceReport.fileName}
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {activeModal === 'submit' && (
        <div className="fixed inset-0 z-80 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-117.5 flex flex-col justify-center rounded-3xl bg-[#F8F8FA] p-6 shadow-[0_25px_70px_-20px_#00000066] md:p-7">
            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#DDF3EA] text-[#08A66A]">
              <Send size={24} />
            </div>

            <h3 className="text-center font-inter text-3xl font-extrabold text-[#2A2F45]">
              Ajukan ke Admin?
            </h3>
            <p className="mt-2 text-center text-base leading-relaxed text-[#737A93]">
              Anda akan mengajukan MOP{' '}
              <span className="font-bold text-[#2A2F45]">
                {report.maintenanceName}
              </span>{' '}
              beserta {report.serviceReports.length} service report untuk
              di-approve admin. Pastikan semua pekerjaan sudah selesai.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="h-12 rounded-2xl border border-[#D2D7E6] bg-white text-base font-semibold text-[#5C647E]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#08A63D] text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  'Ya, Ajukan'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
