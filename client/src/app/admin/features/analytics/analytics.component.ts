import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-admin-analytics', standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './analytics.component.html', styleUrl: './analytics.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsComponent {
  readonly period = signal<'week' | 'month' | 'year'>('month');
  setPeriod(period: 'week' | 'month' | 'year'): void { this.period.set(period); }
}
