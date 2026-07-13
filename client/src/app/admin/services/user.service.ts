import { Injectable, inject, signal } from '@angular/core';
import { AdminUserRepository } from '../repositories/user.repository';
import { AdminUser } from '../models';
import { NotificationService } from '../../shared/services/notification.service';

@Injectable({ providedIn: 'root' })
export class AdminUserService {
  private readonly userRepository = inject(AdminUserRepository);
  private readonly notification = inject(NotificationService);

  readonly users = signal<AdminUser[]>([]);
  readonly loading = signal(false);
  readonly totalPages = signal(1);

  loadUsers(page = 0): void {
    this.loading.set(true);
    this.userRepository.getUsers(page).subscribe({
      next: (r) => { this.users.set(r.content); this.totalPages.set(r.totalPages); this.loading.set(false); },
      error: () => { this.notification.error('Failed to load users'); this.loading.set(false); },
    });
  }
}
