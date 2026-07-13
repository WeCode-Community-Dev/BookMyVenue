import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayoutComponent {
  private readonly authService = inject(AuthService);
  readonly currentUser = this.authService.currentUser;
  readonly sidebarOpen = signal(true);

  readonly navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard' },
    { label: 'Users', path: '/admin/users', icon: 'users' },
    { label: 'Vendors', path: '/admin/vendors', icon: 'vendors' },
    { label: 'Venues', path: '/admin/venues', icon: 'venues' },
    { label: 'Bookings', path: '/admin/bookings', icon: 'bookings' },
    { label: 'Analytics', path: '/admin/analytics', icon: 'analytics' },
    { label: 'Settings', path: '/admin/settings', icon: 'settings' },
  ];

  toggleSidebar(): void { this.sidebarOpen.update(v => !v); }
  logout(): void { this.authService.logout(); }
}
