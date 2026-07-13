import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';

@Component({
  selector: 'app-admin-forgot-password', standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ButtonComponent, InputComponent],
  templateUrl: './forgot-password.component.html', styleUrl: './forgot-password.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly loading = this.authService.loading;
  readonly form = this.fb.nonNullable.group({ email: ['', [Validators.required, Validators.email]] });

  onSubmit(): void {
    if (this.form.valid) {
      this.authService.forgotPassword(this.form.getRawValue(), () => {
        this.router.navigate(['/reset-password']);
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
