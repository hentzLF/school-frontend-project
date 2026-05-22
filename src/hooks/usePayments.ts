"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { PAYMENT_ROUTES } from "@/config/constants";
import type { Payment, CreatePaymentRequest } from "@/types/payment";

export function usePayments() {
  return useQuery<Payment[]>({
    queryKey: ["payments"],
    queryFn: () => api<Payment[]>(PAYMENT_ROUTES.list),
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation<Payment, Error, CreatePaymentRequest>({
    mutationFn: (data) =>
      api<Payment>(PAYMENT_ROUTES.create, { method: "POST", body: data }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["payments"] });
      void queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}
