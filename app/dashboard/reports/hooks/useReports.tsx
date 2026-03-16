import {useState, useEffect, useCallback, useMemo} from 'react';
import {useAppNotification} from '@/lib/use-app-notification';
import {getUserReports} from '../services/reportsService';
import {ReportStatus, ReportSummaryItem, ReportSummaryStats} from '../types';

const EMPTY_STATS: ReportSummaryStats = {
  total: 0,
  ongoing: 0,
  pending: 0,
  approved: 0,
  rejected: 0,
};

export function useReports() {
  const notify = useAppNotification();
  const [reports, setReports] = useState<ReportSummaryItem[]>([]);
  const [stats, setStats] = useState<ReportSummaryStats>(EMPTY_STATS);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | ReportStatus>(
    'all',
  );

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getUserReports();
      setReports(data.items);
      setStats(data.stats);
    } catch (error) {
      notify.error(
        'Gagal Memuat MOP Reports',
        error instanceof Error ? error.message : 'Terjadi kesalahan.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredReports = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return reports.filter((report) => {
      const matchStatus =
        selectedStatus === 'all' ? true : report.status === selectedStatus;

      const searchableText = [
        report.maintenanceName,
        report.maintenanceSpec,
        report.mainFileName,
      ]
        .join(' ')
        .toLowerCase();

      const matchKeyword = keyword ? searchableText.includes(keyword) : true;

      return matchStatus && matchKeyword;
    });
  }, [reports, searchKeyword, selectedStatus]);

  return {
    filteredReports,
    stats,
    isLoading,
    searchKeyword,
    setSearchKeyword,
    selectedStatus,
    setSelectedStatus,
    reload: loadData,
  };
}
