import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class AppValidators {
  static email(control: AbstractControl): ValidationErrors | null {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!control.value) return null;
    return emailRegex.test(control.value) ? null : { email: true };
  }

  static phone(control: AbstractControl): ValidationErrors | null {
    const phoneRegex = /^[0-9]{10}$/;
    if (!control.value) return null;
    return phoneRegex.test(control.value) ? null : { phone: true };
  }

  static matchField(fieldName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const matchControl = control.parent?.get(fieldName);
      if (!matchControl) return null;
      return control.value === matchControl.value ? null : { mismatch: true };
    };
  }

  static minPrice(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      return control.value >= min ? null : { minPrice: { min, actual: control.value } };
    };
  }

  static futureDate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today ? null : { futureDate: true };
  }

  static strongPassword(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,100}$/;
    return pattern.test(control.value) ? null : { strongPassword: true };
  }

  static otp(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    return /^\d{6}$/.test(control.value) ? null : { otp: true };
  }
}
