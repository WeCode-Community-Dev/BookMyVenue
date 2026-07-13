import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../core/config/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';
import { VenueCategory } from '../models/venue.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getCategories(): Observable<VenueCategory[]> {
    return this.http.get<VenueCategory[]>(`${this.apiUrl}${API_ENDPOINTS.CATEGORIES.BASE}`);
  }
}
