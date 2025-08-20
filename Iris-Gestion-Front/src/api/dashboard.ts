import { customFetch } from './customFetch';

export const fetchDashboardStats = async () => {
  return customFetch('/api/stats');
};

export const fetchMonthlySales = async () => {
  return customFetch('/api/stats/sales-by-month');
};