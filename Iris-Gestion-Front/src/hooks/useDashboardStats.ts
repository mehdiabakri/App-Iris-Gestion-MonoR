import { useQuery } from '@tanstack/react-query';

import { fetchDashboardStats, fetchMonthlySales } from '../api/dashboard';

import type { DashboardStats } from '../types/Types';

export const useDashboardStats = () => {
  return useQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
  });
};

export const useMonthlySales = () => {
    return useQuery({
        queryKey: ['monthlySales'],
        queryFn: fetchMonthlySales,
    });
};