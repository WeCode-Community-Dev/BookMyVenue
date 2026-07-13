import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../core/config/environment';
import { API_ENDPOINTS } from '../../shared/constants/api-endpoints.constant';
import { Booking, CreateBookingRequest } from '../../shared/models/booking.model';
import { ApiResponse, PaginationResponse } from '../../shared/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class BookingRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getUserBookings(): Observable<PaginationResponse<Booking>> {
    // Backend returns plain array, wrap it in pagination format
    return this.http.get<Booking[]>(
      `${this.apiUrl}${API_ENDPOINTS.BOOKINGS.MY_BOOKINGS}`
    ).pipe(
      map(data => ({
        success: true,
        data: data,
        total: data.length,
        page: 1,
        limit: data.length,
        totalPages: 1
      }))
    );
  }

  getBookingById(id: string): Observable<ApiResponse<Booking>> {
    return this.http.get<ApiResponse<Booking>>(
      `${this.apiUrl}${API_ENDPOINTS.BOOKINGS.BY_ID(id)}`
    );
  }

  createBooking(payload: CreateBookingRequest): Observable<Booking> {
    return this.http.post<Booking>(
      `${this.apiUrl}${API_ENDPOINTS.BOOKINGS.CREATE_WITH_SLOT(payload.venueId, payload.slotTemplateId)}`,
      payload
    );
  }

  cancelBooking(id: string): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}${API_ENDPOINTS.BOOKINGS.CANCEL(id)}`,
      {}
    );
  }
}
