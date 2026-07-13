import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserLayoutComponent {
  private readonly authService = inject(AuthService);

  readonly currentUser = this.authService.currentUser;
  readonly sidebarOpen = signal(true);

  readonly navItems = [
    { label: 'Browse Venues', path: '/user/venues',      icon: 'search',   requiresAuth: false },
    { label: 'My Bookings',   path: '/user/my-bookings', icon: 'calendar', requiresAuth: true  },
    { label: 'Profile',       path: '/user/profile',     icon: 'user',     requiresAuth: true  },
  ];

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  logout(): void {
    this.authService.logout();
  }
}
