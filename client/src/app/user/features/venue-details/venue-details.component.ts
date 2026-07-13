import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VenueService } from '../../services/venue.service';
import { Venue } from '../../../shared/models/venue.model';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-venue-details',
  standalone: true,
  imports: [ButtonComponent, CurrencyFormatPipe, RouterLink],
  templateUrl: './venue-details.component.html',
  styleUrl: './venue-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VenueDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly venueService = inject(VenueService);

  readonly venue = signal<Venue | null>(null);
  readonly loading = signal(true);
  readonly selectedImage = signal(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    if (id) {
      this.venueService.loadVenueById(id).subscribe({
        next: (venue) => { this.venue.set(venue); this.loading.set(false); },
        error: () => this.loading.set(false),
      });
    }
  }

  selectImage(index: number): void { this.selectedImage.set(index); }

  onBookNow(): void {
    const venue = this.venue();
    if (venue) this.router.navigate(['/user/checkout', venue.id]);
  }
}
