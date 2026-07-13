import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../core/config/environment';
import { API_ENDPOINTS } from '../../shared/constants/api-endpoints.constant';
import { Booking } from '../../shared/models/booking.model';
import { PaginationResponse } from '../../shared/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class AdminBookingRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getBookings(page = 1, limit = 10): Observable<PaginationResponse<Booking>> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<PaginationResponse<Booking>>(`${this.apiUrl}${API_ENDPOINTS.ADMIN.BOOKINGS}`, { params });
  }
}
