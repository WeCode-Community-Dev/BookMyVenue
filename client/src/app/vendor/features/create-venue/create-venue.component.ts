import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VenueService } from '../../services/venue.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { CloudinaryService } from '../../../shared/services/cloudinary.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { CategoryService } from '../../../shared/services/category.service';
import { VenueCategory } from '../../../shared/models/venue.model';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-create-venue',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, InputComponent],
  templateUrl: './create-venue.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateVenueComponent implements OnInit {
  private readonly fb              = inject(FormBuilder);
  private readonly venueService    = inject(VenueService);
  private readonly cloudinary      = inject(CloudinaryService);
  private readonly notification    = inject(NotificationService);
  private readonly categoryService = inject(CategoryService);
  readonly router                  = inject(Router);

  readonly saving = signal(false);
  readonly uploading = signal(false);
  readonly imageUrls = signal<string[]>([]);
  readonly dragOver = signal(false);

  readonly categories = signal<VenueCategory[]>([]);

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories),
      error: () => this.notification.error('Failed to load venue categories'),
    });
  }


  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(20)]],
    address:     ['', [Validators.required]],
    district:    ['', [Validators.required]],
    capacity:    ['', [Validators.required, Validators.min(1)]],
    pricePerSlot:['', [Validators.required, Validators.min(1)]],
    advancePercentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
    categoryId:  ['', [Validators.required, Validators.min(1)]],
  });

  onDragOver(e: DragEvent): void { e.preventDefault(); this.dragOver.set(true); }
  onDragLeave(): void { this.dragOver.set(false); }
  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.dragOver.set(false);
    const files = Array.from(e.dataTransfer?.files ?? []).filter(f => f.type.startsWith('image/'));
    if (files.length) this.uploadFiles(files);
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.uploadFiles(Array.from(input.files));
    input.value = '';
  }

  private uploadFiles(files: File[]): void {
    this.uploading.set(true);
    forkJoin(files.map(f => this.cloudinary.upload(f))).subscribe({
      next: urls => { this.imageUrls.update(existing => [...existing, ...urls]); this.uploading.set(false); },
      error: () => { this.uploading.set(false); this.notification.error('Image upload failed. Please try again.'); },
    });
  }

  removeImage(url: string): void {
    this.imageUrls.update(existing => existing.filter(u => u !== url));
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.saving.set(true);
      const raw = this.form.getRawValue();
      this.venueService.createVenue({
        name: raw.name,
        description: raw.description,
        address: raw.address,
        district: raw.district,
        capacity: Number(raw.capacity),
        pricePerSlot: Number(raw.pricePerSlot),
        advancePercentage: Number(raw.advancePercentage),
        categoryId:   Number(raw.categoryId),
        imageUrls:    this.imageUrls(),
      }).subscribe({
        next: () => { this.saving.set(false); this.router.navigate(['/vendor/venues']); },
        error: () => { this.saving.set(false); this.notification.error('Failed to create venue. Please check your inputs.'); },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
