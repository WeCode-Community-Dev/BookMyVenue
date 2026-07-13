import { Component, inject, ChangeDetectionStrategy, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ButtonComponent, InputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly loading = this.authService.loading;
  readonly pendingVerificationEmail = this.authService.pendingVerificationEmail;

  readonly showVerifyButton = computed(() => this.pendingVerificationEmail() !== null);

  readonly panelFeatures = [
    'Browse 500+ verified venues across India',
    'Real-time availability & instant booking',
    'Transparent pricing with no hidden charges',
  ];

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    if (this.form.valid) {
      this.authService.login(this.form.getRawValue());
    } else {
      this.form.markAllAsTouched();
    }
  }

  onVerify(): void {
    const email = this.pendingVerificationEmail();
    if (email) {
      this.authService.clearPendingVerification();
      this.authService.resendOtp({ email }).subscribe({
        next: () => {
          this.router.navigate(['/verify-email'], {
            queryParams: { email, portal: 'user' },
          });
        },
      });
    }
  }
}
