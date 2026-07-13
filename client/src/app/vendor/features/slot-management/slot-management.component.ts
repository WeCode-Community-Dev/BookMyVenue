import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { VendorSlotService } from '../../services/slot.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

const DAYS = ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'];

@Component({
  selector: 'app-slot-management',
  standalone: true,
  imports: [ReactiveFormsModule, LoaderComponent, EmptyStateComponent],
  templateUrl: './slot-management.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlotManagementComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  readonly slotService = inject(VendorSlotService);

  readonly venueId = signal('');
  readonly days = DAYS;

  readonly form = this.fb.nonNullable.group({
    dayOfWeek: ['', Validators.required],
    startTime: ['', Validators.required],
    endTime:   ['', Validators.required],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.venueId.set(id);
    this.slotService.loadSlots(id);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.slotService.createSlot(this.venueId(), this.form.getRawValue(), () => this.form.reset());
  }

  deleteSlot(id: number): void {
    this.slotService.deleteSlot(id);
  }
}
