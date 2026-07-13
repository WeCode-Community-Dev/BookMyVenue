import { Injectable, inject, signal } from '@angular/core';
import { AdminAnalyticsRepository, AdminAnalyticsData } from '../repositories/analytics.repository';
import { NotificationService } from '../../shared/services/notification.service';

@Injectable({ providedIn: 'root' })
export class AdminAnalyticsService {
  private readonly analyticsRepository = inject(AdminAnalyticsRepository);
  private readonly notification = inject(NotificationService);

  readonly data = signal<AdminAnalyticsData | null>(null);
  readonly loading = signal(false);

  loadAnalytics(period: string): void {
    this.loading.set(true);
    this.analyticsRepository.getAnalytics(period).subscribe({
      next: (r) => { this.data.set(r.data); this.loading.set(false); },
      error: () => { this.notification.error('Failed to load analytics'); this.loading.set(false); },
    });
  }
}
