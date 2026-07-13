import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { VenueRepository } from '../repositories/venue.repository';
import { Venue, VenueFilter } from '../../shared/models/venue.model';
import { NotificationService } from '../../shared/services/notification.service';

@Injectable({ providedIn: 'root' })
export class VenueService {
  private readonly venueRepository = inject(VenueRepository);
  private readonly notification = inject(NotificationService);

  readonly venues = signal<Venue[]>([]);
  readonly loading = signal(false);

  loadVenues(filter?: VenueFilter): void {
    this.loading.set(true);
    this.venueRepository.getVenues(filter).subscribe({
      next: (venues) => {
        this.venues.set(venues);
        this.loading.set(false);
      },
      error: () => {
        this.notification.error('Failed to load venues');
        this.loading.set(false);
      },
    });
  }

  loadVenueById(id: string): Observable<Venue> {
    return this.venueRepository.getVenueById(id);
  }
}
