import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../../shared/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { AppValidators } from '../../../shared/utils/validators';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, InputComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  readonly authService = inject(AuthService);

  readonly loading = signal(false);
  readonly saving = signal(false);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required, AppValidators.phone]],
  });

  ngOnInit(): void {
    this.loading.set(true);
    this.userService.loadProfile().subscribe({
      next: (user) => {
        this.form.patchValue({
          name: user.name,
          phone: user.phone,
        });
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.saving.set(true);
      this.userService.updateProfile(this.form.getRawValue()).subscribe({
        next: () => this.saving.set(false),
        error: () => this.saving.set(false),
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
