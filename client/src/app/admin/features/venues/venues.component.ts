import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { AdminVenueService } from '../../services/venue.service';

@Component({
  selector: 'app-admin-venues',
  standalone: true,
  imports: [LoaderComponent, EmptyStateComponent],
  templateUrl: './venues.component.html',
  styleUrl: './venues.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VenuesComponent implements OnInit {
  readonly venueService = inject(AdminVenueService);
  readonly actingOnId = signal<number | null>(null);

  ngOnInit(): void {
    this.venueService.loadAllVenues();
  }

  approve(id: number): void {
    console.log('id',id);
    if (this.actingOnId() !== null) return;
    this.actingOnId.set(id);
    this.venueService.approveVenue(id, () => this.actingOnId.set(null));
  }

  reject(id: number): void {
    if (this.actingOnId() !== null) return;
    this.actingOnId.set(id);
    this.venueService.rejectVenue(id, () => this.actingOnId.set(null));
  }
}
