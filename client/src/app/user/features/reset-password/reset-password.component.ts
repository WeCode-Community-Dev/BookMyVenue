import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { AppValidators } from '../../../shared/utils/validators';

@Component({
  selector: 'app-user-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ButtonComponent, InputComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly loading = this.authService.loading;

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    otp: ['', [Validators.required, AppValidators.otp]],
    newPassword: ['', [Validators.required, AppValidators.strongPassword]],
    confirmPassword: ['', [Validators.required, AppValidators.matchField('newPassword')]],
  });

  onSubmit(): void {
    if (this.form.valid) {
      const { confirmPassword, ...payload } = this.form.getRawValue();
      this.authService.resetPassword(payload, () => {
        this.router.navigate(['/login']);
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
