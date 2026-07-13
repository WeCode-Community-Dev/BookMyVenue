import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { VendorRepository } from '../repositories/vendor.repository';

@Injectable({ providedIn: 'root' })
export class VendorService {
  private readonly vendorRepository = inject(VendorRepository);

  loadDashboardStats(): Observable<{ totalVenues: number; totalBookings: number; totalRevenue: number; pendingBookings: number }> {
    return this.vendorRepository.getDashboardStats().pipe(map(r => r.data));
  }
}
