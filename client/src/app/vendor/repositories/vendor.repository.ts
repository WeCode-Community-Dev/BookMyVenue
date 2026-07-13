import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../core/config/environment';
import { Vendor, UpdateVendorRequest } from '../../shared/models/vendor.model';
import { ApiResponse } from '../../shared/models/api-response.model';
import { API_ENDPOINTS } from '../../shared/constants/api-endpoints.constant';

@Injectable({ providedIn: 'root' })
export class VendorRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getProfile(): Observable<ApiResponse<Vendor>> {
    // Backend endpoint not available - do not use
    return of({
      success: false,
      message: 'Backend endpoint not available',
      data: {} as Vendor,
    });
  }

  updateProfile(payload: UpdateVendorRequest): Observable<ApiResponse<Vendor>> {
    // Backend endpoint not available - do not use
    return of({
      success: false,
      message: 'Backend endpoint not available',
      data: {} as Vendor,
    });
  }

  getDashboardStats(): Observable<ApiResponse<{ totalVenues: number; totalBookings: number; totalRevenue: number; pendingBookings: number }>> {
    // Fetch venue count from /api/v1/vendor/venues endpoint
    return new Observable(subscriber => {
      this.http.get<any[]>(`${this.apiUrl}${API_ENDPOINTS.VENUES.VENDOR_BASE}`).subscribe({
        next: (venues) => {
          subscriber.next({
            success: true,
            message: 'Dashboard stats loaded',
            data: {
              totalVenues: venues.length,
              totalBookings: 0,
              totalRevenue: 0,
              pendingBookings: 0,
            },
          });
          subscriber.complete();
        },
        error: (err) => {
          subscriber.next({
            success: false,
            message: 'Failed to load dashboard stats',
            data: {
              totalVenues: 0,
              totalBookings: 0,
              totalRevenue: 0,
              pendingBookings: 0,
            },
          });
          subscriber.complete();
        },
      });
    });
  }
}