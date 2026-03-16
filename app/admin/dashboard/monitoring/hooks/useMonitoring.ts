import {useState, useEffect, useCallback} from 'react';
import {useAppNotification} from '@/lib/use-app-notification';
import {getMonitoringReports} from '../services/monitoringService';
import {ReportData} from '../types';

export function useMonitoring() {
  const notify = useAppNotification();
  const [data, setData] = useState<ReportData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const reports = await getMonitoringReports();
      setData(reports);
    } catch (error: unknown) {
      notify.error(
        'Monitoring Load Failed',
        error instanceof Error ? error.message : 'Failed to load reports',
      );
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    isLoading,
    reload: loadData,
  };
}
