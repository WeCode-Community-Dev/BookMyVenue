// src/app/user/services/slot.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../core/config/environment';
import { API_ENDPOINTS } from '../../shared/constants/api-endpoints.constant';
import { TimeSlot } from '../../shared/models/slot.model';

export interface AvailableSlotResponse {
  slotTemplateId: number;
  startTime: string;
  endTime: string;
}

@Injectable({ providedIn: 'root' })
export class SlotService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  readonly slots = signal<TimeSlot[]>([]);
  readonly loading = signal(false);

  loadSlotsForVenue(venueId: string, date: string): Observable<TimeSlot[]> {
    const params = new HttpParams().set('date', date);
    return this.http.get<AvailableSlotResponse[]>(
      `${this.apiUrl}${API_ENDPOINTS.VENUES.AVAILABILITY(venueId)}`,
      { params }
    ).pipe(
      map(slots => (slots || []).map(slot => ({
        id: slot.slotTemplateId,
        label: this.getLabelForSlot(slot.startTime),
        startTime: slot.startTime.substring(0, 5),
        endTime: slot.endTime.substring(0, 5),
        duration: this.formatDuration(slot.startTime, slot.endTime),
        available: true,
        surcharge: 0
      })))
    );
  }

  private getLabelForSlot(startTime: string): string {
    const parts = startTime.split(':').map(Number);
    const hour = parts[0] || 0;
    if (hour < 12) return 'Morning';
    if (hour < 16) return 'Afternoon';
    if (hour < 19) return 'Evening';
    return 'Night';
  }

  private parseTimeToMinutes(timeStr: string): number {
    const parts = timeStr.split(':').map(Number);
    const h = parts[0] || 0;
    const m = parts[1] || 0;
    return h * 60 + m;
  }

  private formatDuration(start: string, end: string): string {
    const startMins = this.parseTimeToMinutes(start);
    const endMins = this.parseTimeToMinutes(end);
    let diff = endMins - startMins;
    if (diff < 0) {
      diff += 24 * 60; // Handle overnight slots
    }
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;
    return mins > 0 ? `${hours} hrs ${mins} mins` : `${hours} hrs`;
  }


  getDummySlots(): TimeSlot[] {
    return [
      { id: 1, label: 'Morning', startTime: '09:00', endTime: '12:00', duration: '3 hrs', available: true, surcharge: 0 },
      { id: 2, label: 'Afternoon', startTime: '12:00', endTime: '16:00', duration: '4 hrs', available: true, surcharge: 2000 },
      { id: 3, label: 'Evening', startTime: '16:00', endTime: '20:00', duration: '4 hrs', available: false, surcharge: 3000 },
      { id: 4, label: 'Night', startTime: '20:00', endTime: '23:00', duration: '3 hrs', available: true, surcharge: 1500 },
      { id: 5, label: 'Full Day', startTime: '09:00', endTime: '23:00', duration: '14 hrs', available: true, surcharge: 8000 },
      { id: 6, label: 'Half Day AM', startTime: '09:00', endTime: '14:00', duration: '5 hrs', available: true, surcharge: 1000 },
    ];
  }
}