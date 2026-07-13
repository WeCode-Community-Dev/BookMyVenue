import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-vendor-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, UpperCasePipe],
  templateUrl: './vendor-layout.component.html',
  styleUrl: './vendor-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VendorLayoutComponent {
  private readonly authService = inject(AuthService);

  readonly currentUser = this.authService.currentUser;
  readonly sidebarOpen = signal(true);

  readonly navItems = [
    { label: 'Dashboard', path: '/vendor/dashboard', icon: 'dashboard' },
    { label: 'My Venues', path: '/vendor/venues', icon: 'venues' },
    { label: 'Bookings', path: '/vendor/bookings', icon: 'bookings' },
    { label: 'Settings', path: '/vendor/settings', icon: 'settings' },
  ];

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  logout(): void {
    this.authService.logout();
  }
}
