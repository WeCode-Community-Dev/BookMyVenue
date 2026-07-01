import { axiosClient } from 'src/lib/axios';

import type {
    VerifyPaymentRequest,
    VerifyPaymentResponse,
    InitiatePaymentRequest,
    InitiatePaymentResponse,
} from './types/payment.type';

export class PaymentApiService {
    static async initiatePayment(data: InitiatePaymentRequest): Promise<InitiatePaymentResponse> {
        const response = await axiosClient.post('/payment/initiate', data);
        return response.data;
    }

    static async verifyPayment(data: VerifyPaymentRequest): Promise<VerifyPaymentResponse> {
        const response = await axiosClient.post('/payment/verify', data);
        return response.data;
    }
}
