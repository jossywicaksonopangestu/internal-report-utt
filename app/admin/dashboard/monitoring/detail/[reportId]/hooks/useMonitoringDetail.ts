import {useCallback, useEffect, useState} from 'react';
import {useAppNotification} from '@/lib/use-app-notification';
import {
  approveReport,
  getMonitoringReportDetail,
  MonitoringReportDetail,
  rejectReport,
} from '../../../services/monitoringService';

export function useMonitoringDetail(reportId: string) {
  const notify = useAppNotification();
  const [report, setReport] = useState<MonitoringReportDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadReport = useCallback(async () => {
    setIsLoading(true);
    try {
      const detail = await getMonitoringReportDetail(reportId);
      setReport(detail);
    } catch (error) {
      notify.error(
        'Gagal Memuat Detail Monitoring',
        error instanceof Error ? error.message : 'Terjadi kesalahan.',
      );
      setReport(null);
    } finally {
      setIsLoading(false);
    }
  }, [notify, reportId]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  const approve = useCallback(
    async (note?: string) => {
      setIsSubmitting(true);
      try {
        await approveReport(reportId, note);
        notify.success('Berhasil', 'MOP berhasil disetujui.');
        await loadReport();
      } catch (error) {
        notify.error(
          'Gagal Menyetujui MOP',
          error instanceof Error ? error.message : 'Terjadi kesalahan.',
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [loadReport, notify, reportId],
  );

  const reject = useCallback(
    async (note: string) => {
      setIsSubmitting(true);
      try {
        await rejectReport(reportId, note);
        notify.success('Berhasil', 'MOP berhasil direject dengan catatan.');
        await loadReport();
      } catch (error) {
        notify.error(
          'Gagal Mereject MOP',
          error instanceof Error ? error.message : 'Terjadi kesalahan.',
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [loadReport, notify, reportId],
  );

  return {
    report,
    isLoading,
    isSubmitting,
    approve,
    reject,
  };
}
