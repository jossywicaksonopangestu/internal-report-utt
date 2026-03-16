import {useCallback, useEffect, useState} from 'react';
import {useAppNotification} from '@/lib/use-app-notification';
import {
  getReportDetail,
  submitReportToAdmin,
} from '../services/reportDetailService';
import {ReportDetail} from '../types';

export function useReportDetail(reportId: string) {
  const notify = useAppNotification();
  const [report, setReport] = useState<ReportDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadReport = useCallback(async () => {
    setIsLoading(true);
    try {
      const detail = await getReportDetail(reportId);
      setReport(detail);
    } catch (error) {
      notify.error(
        'Gagal Memuat Detail MOP',
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

  const submitToAdmin = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await submitReportToAdmin(reportId);
      notify.success('Berhasil', 'MOP berhasil diajukan ke admin.');
      await loadReport();
    } catch (error) {
      notify.error(
        'Gagal Mengajukan MOP',
        error instanceof Error ? error.message : 'Terjadi kesalahan.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [loadReport, notify, reportId]);

  return {
    report,
    isLoading,
    isSubmitting,
    submitToAdmin,
    reload: loadReport,
  };
}
