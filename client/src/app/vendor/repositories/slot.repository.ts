import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../core/config/environment';
import { API_ENDPOINTS } from '../../shared/constants/api-endpoints.constant';
import { SlotTemplate, CreateSlotTemplateRequest } from '../../shared/models/slot.model';

@Injectable({ providedIn: 'root' })
export class VendorSlotRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getSlots(venueId: string): Observable<SlotTemplate[]> {
    return this.http.get<SlotTemplate[]>(
      `${this.apiUrl}${API_ENDPOINTS.VENUES.SLOTS_BY_VENUE(venueId)}`
    );
  }

  createSlot(venueId: string, payload: CreateSlotTemplateRequest): Observable<SlotTemplate> {
    return this.http.post<SlotTemplate>(
      `${this.apiUrl}${API_ENDPOINTS.VENUES.SLOTS_BY_VENUE(venueId)}`,
      payload
    );
  }

  deleteSlot(templateId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}${API_ENDPOINTS.VENUES.DELETE_SLOT(templateId)}`
    );
  }
}
