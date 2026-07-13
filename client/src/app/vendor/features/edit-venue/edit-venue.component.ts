import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { VenueService } from '../../services/venue.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { CloudinaryService } from '../../../shared/services/cloudinary.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { CategoryService } from '../../../shared/services/category.service';
import { VenueCategory } from '../../../shared/models/venue.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-edit-venue',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, InputComponent],
  templateUrl: './edit-venue.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditVenueComponent implements OnInit {
  private readonly route            = inject(ActivatedRoute);
  readonly router                   = inject(Router);
  private readonly fb               = inject(FormBuilder);
  private readonly venueService     = inject(VenueService);
  private readonly cloudinary       = inject(CloudinaryService);
  private readonly notification     = inject(NotificationService);
  private readonly categoryService  = inject(CategoryService);

  readonly loading   = signal(true);
  readonly saving    = signal(false);
  readonly uploading = signal(false);
  readonly imageUrls = signal<string[]>([]);
  readonly dragOver  = signal(false);

  private venueId = '';

  readonly categories = signal<VenueCategory[]>([]);

  readonly form = this.fb.nonNullable.group({
    name:         ['', [Validators.required]],
    description:  ['', [Validators.required, Validators.minLength(20)]],
    address:      ['', [Validators.required]],
    district:     ['', [Validators.required]],
    capacity:     ['', [Validators.required, Validators.min(1)]],
    pricePerSlot: ['', [Validators.required, Validators.min(1)]],
    advancePercentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
    categoryId:   ['', [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    this.venueId = this.route.snapshot.paramMap.get('id') || '';

    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        const match = categories.find(c => c.name === this.pendingCategoryName);
        if (match) this.form.patchValue({ categoryId: String(match.id) });
      },
      error: () => this.notification.error('Failed to load venue categories'),
    });

    if (this.venueId) {
      this.venueService.loadVenueById(this.venueId).subscribe({
        next: (venue) => {
          this.pendingCategoryName = venue.category;
          const match = this.categories().find(c => c.name === venue.category);
          this.form.patchValue({
            name:         venue.name,
            description:  venue.description,
            address:      venue.address,
            district:     venue.district,
            capacity:     String(venue.capacity),
            pricePerSlot: String(venue.pricePerSlot),
            advancePercentage: String(venue.advancePercentage ?? ''),
            categoryId:   match ? String(match.id) : '',
          });
          this.imageUrls.set(venue.imageUrls ?? []);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    }
  }

  private pendingCategoryName = '';

  onDragOver(e: DragEvent): void  { e.preventDefault(); this.dragOver.set(true); }
  onDragLeave(): void             { this.dragOver.set(false); }
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
      error: ()  => { this.uploading.set(false); this.notification.error('Image upload failed. Please try again.'); },
    });
  }

  removeImage(url: string): void {
    this.imageUrls.update(existing => existing.filter(u => u !== url));
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.saving.set(true);
      const raw = this.form.getRawValue();
      this.venueService.updateVenue(this.venueId, {
        name:         raw.name,
        description:  raw.description,
        address:      raw.address,
        district:     raw.district,
        capacity:     Number(raw.capacity),
        pricePerSlot: Number(raw.pricePerSlot),
        advancePercentage: raw.advancePercentage ? Number(raw.advancePercentage) : undefined,
        categoryId:   raw.categoryId ? Number(raw.categoryId) : undefined,
        imageUrls:    this.imageUrls(),
      }).subscribe({
        next: () => { this.saving.set(false); this.router.navigate(['/vendor/venues']); },
        error: ()  => { this.saving.set(false); this.notification.error('Failed to update venue. Please check your inputs.'); },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
