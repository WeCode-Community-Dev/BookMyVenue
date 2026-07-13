import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../core/config/environment';
import { API_ENDPOINTS } from '../../shared/constants/api-endpoints.constant';
import { PaymentOrder, VerifyPaymentRequest } from '../../shared/models/booking.model';

@Injectable({ providedIn: 'root' })
export class PaymentRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  createPaymentOrder(bookingId: number): Observable<PaymentOrder> {
    return this.http.post<PaymentOrder>(
      `${this.apiUrl}${API_ENDPOINTS.PAYMENTS.CREATE(bookingId)}`,
      {}
    );
  }

  verifyPayment(request: VerifyPaymentRequest): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}${API_ENDPOINTS.PAYMENTS.VERIFY}`,
      request
    );
  }
}
