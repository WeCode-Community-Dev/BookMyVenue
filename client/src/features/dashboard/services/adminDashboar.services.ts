import apiClient from '@/services/apiClient';
import type { AdminDashboardData } from '../types/adminDashboard.types';

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const response = await apiClient.get('/admin/dashboard');

  return response.data.data;
}
