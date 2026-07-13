import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../core/config/environment';
import { API_ENDPOINTS } from '../../shared/constants/api-endpoints.constant';
import { ApiResponse } from '../../shared/models/api-response.model';

export interface AdminAnalyticsData {
  totalRevenue: number;
  userGrowth: { date: string; count: number }[];
  bookingTrends: { date: string; count: number }[];
  topVenues: { name: string; bookings: number }[];
}

@Injectable({ providedIn: 'root' })
export class AdminAnalyticsRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getAnalytics(period: string): Observable<ApiResponse<AdminAnalyticsData>> {
    return this.http.get<ApiResponse<AdminAnalyticsData>>(`${this.apiUrl}${API_ENDPOINTS.ADMIN.ANALYTICS}`, { params: { period } });
  }

  getDashboardStats(): Observable<ApiResponse<{ totalUsers: number; totalVendors: number; totalVenues: number; totalBookings: number; totalRevenue: number }>> {
    return this.http.get<ApiResponse<{ totalUsers: number; totalVendors: number; totalVenues: number; totalBookings: number; totalRevenue: number }>>(`${this.apiUrl}${API_ENDPOINTS.ADMIN.DASHBOARD}`);
  }
}
