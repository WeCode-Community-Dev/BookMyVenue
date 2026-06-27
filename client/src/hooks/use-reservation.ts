import { useMutation } from "@tanstack/react-query";
import {
  createReservationRequest,
  createOrderRequest,
  verifyPaymentRequest,
} from "@/api/reservation-api";

export const useCreateReservation = () =>
  useMutation({ mutationFn: createReservationRequest });

export const useCreateOrder = () => useMutation({ mutationFn: createOrderRequest });

export const useVerifyPayment = () => useMutation({ mutationFn: verifyPaymentRequest });
