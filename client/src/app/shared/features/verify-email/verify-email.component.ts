import { Component, inject, signal, ChangeDetectionStrategy, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ButtonComponent } from '../../components/button/button.component';
import { AUTH_ERRORS } from '../../constants/auth-errors.constant';
import { Subscription, interval, takeWhile } from 'rxjs';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ButtonComponent],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyEmailComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  readonly email = signal<string>('');
  readonly portal = signal<'user' | 'vendor' | 'admin'>('user');
  readonly loading = signal(false);
  readonly error = signal('');
  readonly countdown = signal(0);
  readonly resendLoading = signal(false);

  private countdownSubscription: Subscription | null = null;

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  readonly form = this.fb.group({
    otp1: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
    otp2: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
    otp3: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
    otp4: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
    otp5: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
    otp6: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
  });

  constructor() {
    const emailParam = this.route.snapshot.queryParamMap.get('email');
    const portalParam = this.route.snapshot.queryParamMap.get('portal') as 'user' | 'vendor' | 'admin' | null;

    if (!emailParam) {
      this.router.navigate(['/signup']);
      return;
    }

    this.email.set(emailParam);
    this.portal.set(portalParam || 'user');
    this.startCountdown();
  }

  onInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value.length === 1 && index < 5) {
      const inputs = this.otpInputs.toArray();
      inputs[index + 1].nativeElement.focus();
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text');
    if (pastedData && pastedData.length >= 6) {
      const otpArray = pastedData.slice(0, 6).split('');
      otpArray.forEach((char, index) => {
        const controlName = `otp${index + 1}` as keyof typeof this.form.controls;
        this.form.get(controlName)?.setValue(char);
      });
      const inputs = this.otpInputs.toArray();
      inputs[5].nativeElement.focus();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace') {
      const control = this.form.get(`otp${index + 1}`);
      if (control?.value === '' && index > 0) {
        const inputs = this.otpInputs.toArray();
        inputs[index - 1].nativeElement.focus();
      }
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const otp = Object.values(this.form.value).join('');
    this.loading.set(true);
    this.error.set('');

    this.authService.verifyEmail({ email: this.email(), otp }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/login'], { queryParams: { portal: this.portal() } });
      },
      error: (err) => {
        this.loading.set(false);
        if (err.error?.code === AUTH_ERRORS.INVALID_OTP || err.error?.code === AUTH_ERRORS.OTP_EXPIRED) {
          this.error.set(err.error?.message || 'Invalid or expired OTP');
        } else {
          this.error.set('Verification failed. Please try again.');
        }
      },
    });
  }

  onResend(): void {
    if (this.countdown() > 0 || this.resendLoading()) return;

    this.resendLoading.set(true);
    this.error.set('');

    this.authService.resendOtp({ email: this.email() }).subscribe({
      next: () => {
        this.resendLoading.set(false);
        this.startCountdown();
      },
      error: () => {
        this.resendLoading.set(false);
        this.error.set('Failed to resend OTP. Please try again.');
      },
    });
  }

  private startCountdown(): void {
    this.countdown.set(30);
    this.countdownSubscription?.unsubscribe();
    this.countdownSubscription = interval(1000)
      .pipe(takeWhile(() => this.countdown() > 0))
      .subscribe(() => {
        this.countdown.update((v) => v - 1);
      });
  }
}