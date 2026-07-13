import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { AppValidators } from '../../../shared/utils/validators';

@Component({
  selector: 'app-user-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ButtonComponent, InputComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly loading = this.authService.loading;

  readonly venueTypes = ['Weddings', 'Corporate', 'Birthday', 'Conferences', 'Social', 'Outdoor'];

  readonly form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, AppValidators.phone]],
    password: ['', [Validators.required, AppValidators.strongPassword]],
    confirmPassword: ['', [Validators.required, AppValidators.matchField('password')]],
    isVendor: [false],
  });

  onSubmit(): void {
    if (this.form.valid) {
      const { confirmPassword, ...payload } = this.form.getRawValue();
      this.authService.signup(payload).subscribe({
        next: () => {
          const portal = payload.isVendor ? 'vendor' : 'user';
          this.router.navigate(['/verify-email'], {
            queryParams: { email: payload.email, portal },
          });
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
