import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../core/config/environment';
import { API_ENDPOINTS } from '../../shared/constants/api-endpoints.constant';

export interface AdminVenue {
  id: number;
  name: string;
  district: string;
  address: string;
  capacity: number;
  ownerName: string;
  ownerEmail: string;
  status?: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalVendors: number;
  totalVenues: number;
  pendingVenues: number;
  approvedVenues: number;
  rejectedVenues: number;
  totalBookings: number;
}

export interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

@Injectable({ providedIn: 'root' })
export class AdminVenueRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getDashboard(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}${API_ENDPOINTS.ADMIN.DASHBOARD}`);
  }

  getAllVenues(page = 0, size = 10): Observable<SpringPage<AdminVenue>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<SpringPage<AdminVenue>>(`${this.apiUrl}${API_ENDPOINTS.ADMIN.VENUES}`, { params });
  }

  getPendingVenues(page = 0, size = 10): Observable<SpringPage<AdminVenue>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<SpringPage<AdminVenue>>(`${this.apiUrl}${API_ENDPOINTS.ADMIN.PENDING_VENUES}`, { params });
  }

  approveVenue(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}${API_ENDPOINTS.ADMIN.VENUE_APPROVE(id)}`, {});
  }

  rejectVenue(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}${API_ENDPOINTS.ADMIN.VENUE_REJECT(id)}`, {});
  }
}
