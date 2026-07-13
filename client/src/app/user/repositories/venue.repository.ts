import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../core/config/environment';
import { API_ENDPOINTS } from '../../shared/constants/api-endpoints.constant';
import { Venue, VenueFilter } from '../../shared/models/venue.model';

@Injectable({ providedIn: 'root' })
export class VenueRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getVenues(filter?: VenueFilter): Observable<Venue[]> {
    let params = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, String(value));
        }
      });
    }
    return this.http.get<Venue[]>(
      `${this.apiUrl}${API_ENDPOINTS.VENUES.PUBLIC_BASE}`,
      { params }
    ).pipe(
      map(venues => (venues || []).map(venue => ({
        ...venue,
        id: String(venue.id),
        imageUrls: venue.imageUrls || []
      })))
    );
  }

  getVenueById(id: string): Observable<Venue> {
    return this.http.get<Venue>(
      `${this.apiUrl}${API_ENDPOINTS.VENUES.PUBLIC_BY_ID(id)}`
    ).pipe(
      map(venue => ({
        ...venue,
        id: String(venue.id),
        imageUrls: venue.imageUrls || []
      }))
    );
  }
  
}
