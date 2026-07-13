import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';

@Component({
  selector: 'app-vendor-settings',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, InputComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  private readonly fb = inject(FormBuilder);
  readonly saving = signal(false);

  readonly form = this.fb.nonNullable.group({
    businessName: ['', [Validators.required]],
    contactPerson: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    address: ['', [Validators.required]],
  });

  onSubmit(): void {
    if (this.form.valid) {
      this.saving.set(true);
      setTimeout(() => this.saving.set(false), 1000);
    }
  }
}
