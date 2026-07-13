import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../core/config/environment';
import { API_ENDPOINTS } from '../../shared/constants/api-endpoints.constant';
import { Booking } from '../../shared/models/booking.model';
import { ApiResponse, PaginationResponse, SpringPage } from '../../shared/models/api-response.model';

interface VendorBookingFilters {
  status?: string;
  venueId?: number;
}

@Injectable({ providedIn: 'root' })
export class VendorBookingRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getVendorBookings(filters: VendorBookingFilters = {}): Observable<PaginationResponse<Booking>> {
    let params = new HttpParams();

    if (filters.status) {
      params = params.set('status', filters.status);
    }

    if (filters.venueId !== undefined) {
      params = params.set('venueId', filters.venueId);
    }

    return this.http.get<Booking[] | PaginationResponse<Booking> | SpringPage<Booking>>(
      `${this.apiUrl}${API_ENDPOINTS.BOOKINGS.BY_VENDOR}`,
      { params }
    ).pipe(
      map((response) => {
        if (Array.isArray(response)) {
          return {
            success: true,
            data: response,
            total: response.length,
            page: 1,
            limit: response.length,
            totalPages: 1,
          } satisfies PaginationResponse<Booking>;
        }

        if ('content' in response) {
          return {
            success: true,
            data: response.content,
            total: response.totalElements,
            page: response.number + 1,
            limit: response.size,
            totalPages: response.totalPages,
          } satisfies PaginationResponse<Booking>;
        }

        return response;
      })
    );
  }

  updateBookingStatus(id: string, status: string): Observable<ApiResponse<Booking>> {
    const byIdEndpoint = `/bookings/${id}`;
    return this.http.patch<ApiResponse<Booking>>(`${this.apiUrl}${byIdEndpoint}`, { status });
  }
}