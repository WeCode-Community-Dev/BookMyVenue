import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VenueService } from '../../services/venue.service';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-venue-list',
  standalone: true,
  imports: [RouterLink, FormsModule, CurrencyFormatPipe],
  templateUrl: './venue-list.component.html',
  styleUrl: './venue-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VenueListComponent implements OnInit {
  private readonly venueService = inject(VenueService);

  readonly venues = this.venueService.venues;
  readonly loading = this.venueService.loading;
  readonly searchQuery = signal('');

  ngOnInit(): void {
    this.venueService.loadVenues();
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
    this.venueService.loadVenues({ search: query });
  }
}
