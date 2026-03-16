'use client';

import {useMemo, useState} from 'react';
import Link from 'next/link';
import {useParams} from 'next/navigation';
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  FileText,
  Loader2,
  Send,
  User2,
  XCircle,
} from 'lucide-react';
import {Input, Spin} from 'antd';
import {useMonitoringDetail} from './hooks/useMonitoringDetail';

function formatLongDate(value: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}

function StatusBadge({
  status,
}: {
  status: 'ongoing' | 'pending' | 'approved' | 'rejected';
}) {
  const config = {
    ongoing: {
      label: 'Ongoing',
      className: 'bg-[#EAF2FF] text-[#2F6FE5]',
    },
    pending: {
      label: 'Menunggu Approval',
      className: 'bg-[#FFF5E4] text-[#D97706]',
    },
    approved: {
      label: 'Approved',
      className: 'bg-[#ECFDF3] text-[#15803D]',
    },
    rejected: {
      label: 'Rejected',
      className: 'bg-[#FFF1F2] text-[#DC2626]',
    },
  }[status];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}

export default function AdminMonitoringDetailPage() {
  const params = useParams<{reportId: string}>();
  const reportId = params.reportId;
  const {report, isLoading, isSubmitting, approve, reject} =
    useMonitoringDetail(reportId);

  const [activeModal, setActiveModal] = useState<'approve' | 'reject' | null>(
    null,
  );
  const [approveNote, setApproveNote] = useState('');
  const [rejectNote, setRejectNote] = useState('');
  const [rejectError, setRejectError] = useState<string | null>(null);

  const primaryFileName = useMemo(
    () => report?.serviceReports[0]?.fileName ?? '-',
    [report],
  );

  const handleConfirmApprove = async () => {
    await approve(approveNote);
    setApproveNote('');
    setActiveModal(null);
  };

  const handleConfirmReject = async () => {
    if (!rejectNote.trim()) {
      setRejectError('Alasan penolakan wajib diisi.');
      return;
    }

    setRejectError(null);
    await reject(rejectNote);
    setRejectNote('');
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
        Detail monitoring tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-370 pb-8 md:pb-10">
      <Link
        href="/admin/dashboard/monitoring"
        className="mb-3 inline-flex items-center gap-1.5 text-sm text-white/90 transition-colors hover:text-white"
      >
        <ChevronLeft size={15} />
        Kembali ke Monitoring
      </Link>

      <section className="rounded-[22px] bg-[#F3F5FF] p-4 text-[#2B315F] shadow-[0px_20px_38px_-24px_#0A0E2A] md:p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="font-inter text-3xl leading-tight font-extrabold md:text-4xl">
              {report.maintenanceName}
            </h1>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-[#7B84A8]">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#3F467E] text-xs font-bold text-white">
                {(report.picName || 'E').slice(0, 1).toUpperCase()}
              </span>
              Engineer: {report.picName}
            </p>
          </div>

          <StatusBadge status={report.status} />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
          <div className="rounded-2xl bg-white px-3 py-3">
            <p className="text-xs text-[#9AA0BD]">File MOP</p>
            <p className="mt-1 line-clamp-1 text-base font-semibold text-[#48507F]">
              {primaryFileName}
            </p>
          </div>

          <div className="rounded-2xl bg-white px-3 py-3">
            <p className="inline-flex items-center gap-1 text-xs text-[#9AA0BD]">
              <CalendarDays size={12} />
              Tanggal Mulai
            </p>
            <p className="mt-1 text-base font-semibold text-[#48507F]">
              {formatLongDate(report.startDate)}
            </p>
          </div>

          <div className="rounded-2xl bg-white px-3 py-3">
            <p className="inline-flex items-center gap-1 text-xs text-[#9AA0BD]">
              <CalendarDays size={12} />
              Tanggal Selesai
            </p>
            <p className="mt-1 text-base font-semibold text-[#48507F]">
              {formatLongDate(report.endDate)}
            </p>
          </div>

          <div className="rounded-2xl bg-[#E9ECFF] px-3 py-3">
            <p className="text-xs text-[#8E95B7]">Service Reports</p>
            <p className="mt-1 text-4xl leading-none font-bold text-[#2F376B]">
              {report.serviceReports.length}
            </p>
          </div>
        </div>

        {report.status !== 'ongoing' && (
          <div className="mt-4 rounded-2xl border border-[#F3DBA8] bg-[#FFF9E9] px-3 py-2.5 text-sm text-[#D97706]">
            <p className="inline-flex items-center gap-1.5">
              <Send size={14} />
              Diajukan untuk approval pada {formatLongDate(report.submittedAt)}
            </p>
          </div>
        )}

        {report.status === 'approved' && (
          <div className="mt-3 rounded-2xl border border-[#B9ECCF] bg-[#EFFFF5] px-3 py-2.5 text-sm text-[#138A56]">
            <p className="inline-flex items-center gap-1.5 font-semibold">
              <CheckCircle2 size={15} />
              MOP Disetujui • {formatLongDate(report.updatedAt)}
            </p>
            <p className="mt-1">
              Catatan:{' '}
              {report.adminNote ||
                'Approved. Semua dokumentasi lengkap dan sesuai prosedur.'}
            </p>
          </div>
        )}

        {report.status === 'rejected' && (
          <div className="mt-3 rounded-2xl border border-[#F2BCC1] bg-[#FFF1F2] px-3 py-2.5 text-sm text-[#DF3642]">
            <p className="inline-flex items-center gap-1.5 font-semibold">
              <XCircle size={15} />
              MOP Ditolak • {formatLongDate(report.updatedAt)}
            </p>
            <p className="mt-1">
              Catatan:{' '}
              {report.revisionNote ||
                'Engineer perlu melengkapi dokumen lalu ajukan ulang.'}
            </p>
          </div>
        )}

        {report.status === 'ongoing' && (
          <div className="mt-3 rounded-2xl border border-[#C7DAFF] bg-[#EDF4FF] px-3 py-2.5 text-sm text-[#2F6FE5]">
            MOP masih dalam proses pengerjaan engineer dan belum diajukan ke
            admin.
          </div>
        )}

        {report.status === 'pending' && (
          <div className="mt-6">
            <p className="mb-2 text-base font-semibold text-[#4A527D]">
              Tindakan Admin
            </p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={() => setActiveModal('approve')}
                disabled={isSubmitting}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#08A66A] px-4 text-sm font-semibold text-white shadow-[0px_12px_22px_-14px_#066C46] transition-colors hover:bg-[#09935E] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <CheckCircle2 size={16} />
                Approve MOP
              </button>
              <button
                type="button"
                onClick={() => setActiveModal('reject')}
                disabled={isSubmitting}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#F70008] px-4 text-sm font-semibold text-white shadow-[0px_12px_22px_-14px_#A9030A] transition-colors hover:bg-[#D9070D] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <XCircle size={16} />
                Reject MOP
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="mt-5 rounded-[22px] bg-[#F3F5FF] p-4 text-[#2B315F] shadow-[0px_20px_38px_-24px_#0A0E2A] md:p-6">
        <h2 className="font-inter text-2xl leading-tight font-extrabold md:text-3xl">
          Service Reports
          <span className="ml-1 text-lg font-semibold text-[#9AA0BD]">
            ({report.serviceReports.length} laporan)
          </span>
        </h2>

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

      {activeModal === 'approve' && (
        <div className="fixed inset-0 z-90 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full flex flex-col justify-center max-w-115 rounded-3xl bg-[#F8F8FA] p-6 shadow-[0_25px_70px_-20px_#00000066] md:p-7">
            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#DDF3EA] text-[#08A66A]">
              <CheckCircle2 size={26} />
            </div>

            <h3 className="text-center font-inter text-3xl font-extrabold text-[#2A2F45]">
              Approve MOP ini?
            </h3>
            <p className="mt-2 text-center text-base leading-relaxed text-[#737A93]">
              MOP{' '}
              <span className="font-bold text-[#2A2F45]">
                {report.maintenanceName}
              </span>{' '}
              akan disetujui dan tidak dapat dibatalkan.
            </p>

            <label className="mt-4 mb-1 block text-base font-medium text-[#67708B]">
              Catatan untuk Engineer (opsional)
            </label>
            <Input.TextArea
              rows={3}
              value={approveNote}
              onChange={(event) => setApproveNote(event.target.value)}
              placeholder="Contoh: Dokumen lengkap dan sesuai prosedur."
              className="rounded-2xl"
            />

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  setApproveNote('');
                }}
                className="h-12 rounded-2xl border border-[#D2D7E6] bg-white text-base font-semibold text-[#5C647E]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmApprove}
                disabled={isSubmitting}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#08A66A] text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 size={15} />
                    Ya, Approve
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'reject' && (
        <div className="fixed inset-0 z-90 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full flex flex-col justify-center max-w-115 rounded-3xl bg-[#F8F8FA] p-6 shadow-[0_25px_70px_-20px_#00000066] md:p-7">
            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F8EDEF] text-[#FF3B45]">
              <XCircle size={26} />
            </div>

            <h3 className="text-center font-inter text-3xl font-extrabold text-[#2A2F45]">
              Reject MOP ini?
            </h3>
            <p className="mt-2 text-center text-base leading-relaxed text-[#737A93]">
              MOP{' '}
              <span className="font-bold text-[#2A2F45]">
                {report.maintenanceName}
              </span>{' '}
              akan ditolak. Engineer dapat merevisi dan mengajukan ulang.
            </p>

            <label className="mt-4 mb-1 block text-base font-medium text-[#67708B]">
              Alasan Penolakan <span className="text-[#F5222D]">*</span>
            </label>
            <Input.TextArea
              rows={3}
              value={rejectNote}
              onChange={(event) => {
                setRejectNote(event.target.value);
                if (rejectError) {
                  setRejectError(null);
                }
              }}
              placeholder="Jelaskan alasan penolakan MOP ini..."
              className="rounded-2xl"
            />
            {rejectError && (
              <p className="mt-1 text-sm text-[#CF1322]">{rejectError}</p>
            )}

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  setRejectNote('');
                  setRejectError(null);
                }}
                className="h-12 rounded-2xl border border-[#D2D7E6] bg-white text-base font-semibold text-[#5C647E]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                disabled={isSubmitting}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#FF0008] text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <XCircle size={15} />
                    Ya, Reject
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
