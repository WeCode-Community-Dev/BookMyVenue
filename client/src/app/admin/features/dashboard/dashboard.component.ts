import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AdminVenueService } from '../../services/venue.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  readonly venueService = inject(AdminVenueService);

  ngOnInit(): void {
    this.venueService.loadDashboard();
  }
}
