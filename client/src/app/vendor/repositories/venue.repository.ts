import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../core/config/environment';
import { API_ENDPOINTS } from '../../shared/constants/api-endpoints.constant';
import { Venue, CreateVenueRequest, UpdateVenueRequest } from '../../shared/models/venue.model';

@Injectable({ providedIn: 'root' })
export class VendorVenueRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getVendorVenues(): Observable<Venue[]> {
    return this.http.get<Venue[]>(`${this.apiUrl}${API_ENDPOINTS.VENUES.VENDOR_BASE}`);
  }

  getVenueById(id: string): Observable<Venue> {
    return this.http.get<Venue>(`${this.apiUrl}${API_ENDPOINTS.VENUES.VENDOR_BY_ID(id)}`);
  }

  createVenue(payload: CreateVenueRequest): Observable<Venue> {
    return this.http.post<Venue>(`${this.apiUrl}${API_ENDPOINTS.VENUES.VENDOR_BASE}`, payload);
  }

  updateVenue(id: string, payload: UpdateVenueRequest): Observable<Venue> {
    return this.http.patch<Venue>(`${this.apiUrl}${API_ENDPOINTS.VENUES.PUBLIC_BY_ID(id)}`, payload);
  }

  deleteVenue(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${API_ENDPOINTS.VENUES.PUBLIC_BY_ID(id)}`);
  }
}
