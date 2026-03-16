import {useState} from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  ChevronRight,
  Download,
  FileText,
  Printer,
  User2,
} from 'lucide-react';
import {useAppNotification} from '@/lib/use-app-notification';
import {
  createMonitoringPdf,
  getMonitoringPdfFilename,
} from '../helpers/monitoringPdf';
import {ReportData} from '../types';

const STATUS_META: Record<
  ReportData['status'],
  {
    label: string;
    chipClassName: string;
  }
> = {
  pending: {
    label: 'Menunggu Approval',
    chipClassName: 'bg-[#FFF5E4] text-[#D97706]',
  },
  approved: {
    label: 'Approved',
    chipClassName: 'bg-[#ECFDF3] text-[#15803D]',
  },
  rejected: {
    label: 'Rejected',
    chipClassName: 'bg-[#FFF1F2] text-[#DC2626]',
  },
  ongoing: {
    label: 'Ongoing',
    chipClassName: 'bg-[#EAF2FF] text-[#2F6FE5]',
  },
};

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

interface MonitoringReportCardProps {
  item: ReportData;
}

export function MonitoringReportCard({item}: MonitoringReportCardProps) {
  const notify = useAppNotification();
  const isPending = item.status === 'pending';
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadPdf = () => {
    if (isExporting) return;

    try {
      setIsExporting(true);
      const doc = createMonitoringPdf(item);
      doc.save(getMonitoringPdfFilename(item));
    } catch (error) {
      notify.error(
        'Gagal Download PDF',
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat membuat PDF.',
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrintPdf = () => {
    if (isExporting) return;

    try {
      setIsExporting(true);
      const doc = createMonitoringPdf(item);
      doc.autoPrint();

      const blobUrl = doc.output('bloburl');
      const printWindow = window.open(blobUrl, '_blank', 'noopener,noreferrer');

      if (!printWindow) {
        notify.warning(
          'Popup Terblokir',
          'Izinkan popup browser agar preview print PDF bisa dibuka.',
        );
      }
    } catch (error) {
      notify.error(
        'Gagal Print PDF',
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat membuat PDF.',
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <article
      className={`rounded-2xl border px-4 py-3.5 shadow-md transition-transform hover:scale-[1.002] md:px-5 ${isPending ? 'border-[#F3DBA8] bg-[#FFF9E9]' : 'border-[#E2E6F6] bg-white'}`}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <h3 className="line-clamp-1 text-base font-bold text-[#252C66] md:text-lg">
            {item.maintenanceName}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#8B90AF]">
            <span className="inline-flex items-center gap-1">
              <User2 size={12} />
              {item.picName}
            </span>
            <span className="inline-flex items-center gap-1">
              <CalendarDays size={12} />
              {formatShortDate(item.startDate)} -{' '}
              {formatShortDate(item.endDate)}
            </span>
            <span className="inline-flex items-center gap-1">
              <FileText size={12} />
              {item.serviceReportCount} service report
            </span>
            <span className="inline-flex items-center gap-1">
              Diajukan: {formatShortDate(item.submittedDate)}
            </span>
          </div>
        </div>

        <div className="inline-flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_META[item.status].chipClassName}`}
          >
            {STATUS_META[item.status].label}
          </span>
          <button
            type="button"
            onClick={handlePrintPdf}
            disabled={isExporting}
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#D6DCF5] bg-white px-2 text-xs font-semibold text-[#3F467E] transition-colors hover:bg-[#EEF2FF] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Printer size={13} />
            Print
          </button>
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#D6DCF5] bg-white px-2 text-xs font-semibold text-[#3F467E] transition-colors hover:bg-[#EEF2FF] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Download size={13} />
            PDF
          </button>
          <Link
            href={`/admin/dashboard/monitoring/detail/${item.id}`}
            className="inline-flex h-8 items-center gap-1 rounded-lg bg-[#3F467E] px-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#343A6D]"
          >
            Detail
            <ChevronRight size={14} className="text-white" />
          </Link>
        </div>
      </div>
    </article>
  );
}
