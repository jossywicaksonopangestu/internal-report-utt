import {useCallback, useEffect, useState} from 'react';
import {useAppNotification} from '@/lib/use-app-notification';
import {DashboardData, getDashboardData} from '../services/dashboardService';

export function useDashboard() {
  const notify = useAppNotification();
  const [dashboard, setDashboard] = useState<DashboardData>({
    statusSummary: {
      total: 0,
      ongoing: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
    },
    engineerCount: 0,
    serviceReportCount: 0,
    pendingItems: [],
    latestActivity: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await getDashboardData();
      setDashboard(data);
    } catch (error) {
      notify.error(
        'Dashboard Load Failed',
        error instanceof Error ? error.message : 'Failed to load dashboard',
      );
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return {
    dashboard,
    isLoading,
  };
}
