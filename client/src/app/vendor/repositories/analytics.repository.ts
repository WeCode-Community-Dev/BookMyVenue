import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../core/config/environment';
import { API_ENDPOINTS } from '../../shared/constants/api-endpoints.constant';
import { ApiResponse } from '../../shared/models/api-response.model';

export interface AnalyticsData {
  revenue: { date: string; amount: number }[];
  bookings: { date: string; count: number }[];
  topVenues: { name: string; bookings: number; revenue: number }[];
}

@Injectable({ providedIn: 'root' })
export class VendorAnalyticsRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getAnalytics(period: string): Observable<ApiResponse<AnalyticsData>> {
    return this.http.get<ApiResponse<AnalyticsData>>(`${this.apiUrl}${API_ENDPOINTS.VENDORS.ANALYTICS}`, { params: { period } });
  }
}
