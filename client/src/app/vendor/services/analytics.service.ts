import { Injectable, inject, signal } from '@angular/core';
import { VendorAnalyticsRepository, AnalyticsData } from '../repositories/analytics.repository';
import { NotificationService } from '../../shared/services/notification.service';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly analyticsRepository = inject(VendorAnalyticsRepository);
  private readonly notification = inject(NotificationService);

  readonly data = signal<AnalyticsData | null>(null);
  readonly loading = signal(false);

  loadAnalytics(period: string): void {
    this.loading.set(true);
    this.analyticsRepository.getAnalytics(period).subscribe({
      next: (response) => { this.data.set(response.data); this.loading.set(false); },
      error: () => { this.notification.error('Failed to load analytics'); this.loading.set(false); },
    });
  }
}
