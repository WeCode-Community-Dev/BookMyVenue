import { Injectable, inject, signal } from '@angular/core';
import { AdminVendorRepository } from '../repositories/vendor.repository';
import { AdminUser } from '../models';
import { NotificationService } from '../../shared/services/notification.service';

@Injectable({ providedIn: 'root' })
export class AdminVendorService {
  private readonly vendorRepository = inject(AdminVendorRepository);
  private readonly notification = inject(NotificationService);

  readonly vendors = signal<AdminUser[]>([]);
  readonly loading = signal(false);
  readonly totalPages = signal(1);

  loadVendors(page = 0): void {
    this.loading.set(true);
    this.vendorRepository.getVendors(page).subscribe({
      next: (r) => { this.vendors.set(r.content); this.totalPages.set(r.totalPages); this.loading.set(false); },
      error: () => { this.notification.error('Failed to load vendors'); this.loading.set(false); },
    });
  }
}
