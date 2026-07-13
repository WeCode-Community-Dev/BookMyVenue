import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { VendorVenueRepository } from '../repositories/venue.repository';
import { Venue, CreateVenueRequest, UpdateVenueRequest } from '../../shared/models/venue.model';
import { NotificationService } from '../../shared/services/notification.service';

@Injectable({ providedIn: 'root' })
export class VenueService {
  private readonly venueRepository = inject(VendorVenueRepository);
  private readonly notification = inject(NotificationService);

  readonly venues = signal<Venue[]>([]);
  readonly loading = signal(false);

  loadVendorVenues(): void {
    this.loading.set(true);
    this.venueRepository.getVendorVenues().subscribe({
      next: (response) => { this.venues.set(response);},
      error: () => { this.notification.error('Failed to load venues');},
      complete:() => { this.loading.set(false);}
    });
  }

  loadVenueById(id: string): Observable<Venue> {
    return this.venueRepository.getVenueById(id);
  }

  createVenue(payload: CreateVenueRequest): Observable<Venue> {
    return this.venueRepository.createVenue(payload);
  }

  updateVenue(id: string, payload: UpdateVenueRequest): Observable<Venue> {
    return this.venueRepository.updateVenue(id, payload);
  }
  
  deleteVenue(id:string):Observable<void>{
    return this.venueRepository.deleteVenue(id);
  }
}
