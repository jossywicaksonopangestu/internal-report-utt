import {useCallback, useEffect, useState} from 'react';
import {DashboardData, EMPTY_DASHBOARD} from '../types';
import {getUserDashboardData} from '../services/dashboardService';

export function useDashboardOverview() {
  const [dashboard, setDashboard] = useState<DashboardData>(EMPTY_DASHBOARD);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await getUserDashboardData();
      setDashboard(data);
    } catch {
      setDashboard(EMPTY_DASHBOARD);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return {
    dashboard,
    isLoading,
    reload: loadDashboard,
  };
}
