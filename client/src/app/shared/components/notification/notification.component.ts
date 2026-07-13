import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [NgClass],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {
  readonly notificationService = inject(NotificationService);
  readonly notifications = this.notificationService.notifications;

  dismiss(id: string): void {
    this.notificationService.dismiss(id);
  }
}
