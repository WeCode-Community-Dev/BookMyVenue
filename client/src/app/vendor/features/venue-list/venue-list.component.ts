import { Component, inject, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { VenueService } from '../../services/venue.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-vendor-venue-list',
  standalone: true,
  imports: [RouterLink, LoaderComponent, EmptyStateComponent],
  templateUrl: './venue-list.component.html',
  styleUrl: './venue-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VenueListComponent implements OnInit {
  private readonly venueService = inject(VenueService);

  readonly venues = this.venueService.venues;
  readonly loading = this.venueService.loading;
  readonly deleting = signal<string | null>(null);

  ngOnInit(): void {
    this.venueService.loadVendorVenues();
  }

  deleteVenue(id:string):void{
    if(!confirm('Are you sure you want to delete this venue?')) return;
    this.deleting.set(id);
    this.venueService.deleteVenue(id).subscribe(({
      next:()=>{
        this.venueService.loadVendorVenues();
        this.deleting.set(null);
      },
      error:() => this.deleting.set(null),
    }))
  }


}
