import { Injectable, inject, signal } from '@angular/core';
import { VendorSlotRepository } from '../repositories/slot.repository';
import { SlotTemplate, CreateSlotTemplateRequest } from '../../shared/models/slot.model';
import { NotificationService } from '../../shared/services/notification.service';

@Injectable({ providedIn: 'root' })
export class VendorSlotService {
  private readonly repo = inject(VendorSlotRepository);
  private readonly notification = inject(NotificationService);

  readonly slots = signal<SlotTemplate[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly deletingId = signal<number | null>(null);

  loadSlots(venueId: string): void {
    this.loading.set(true);
    this.repo.getSlots(venueId).subscribe({
      next: (slots) => { this.slots.set(slots); this.loading.set(false); },
      error: () => { this.notification.error('Failed to load slots'); this.loading.set(false); },
    });
  }

  createSlot(venueId: string, payload: CreateSlotTemplateRequest, onDone: () => void): void {
    this.saving.set(true);
    this.repo.createSlot(venueId, payload).subscribe({
      next: (slot) => {
        this.slots.update(list => [...list, slot]);
        this.notification.success('Slot created');
        this.saving.set(false);
        onDone();
      },
      error: () => { this.notification.error('Failed to create slot'); this.saving.set(false); },
    });
  }

  deleteSlot(templateId: number): void {
    this.deletingId.set(templateId);
    this.repo.deleteSlot(templateId).subscribe({
      next: () => {
        this.slots.update(list => list.filter(s => s.id !== templateId));
        this.notification.success('Slot deleted');
        this.deletingId.set(null);
      },
      error: () => { this.notification.error('Failed to delete slot'); this.deletingId.set(null); },
    });
  }
}
