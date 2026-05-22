export type Payment = {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: "Pending" | "Completed" | "Failed" | "Refunded";
  paymentMethod: string;
  transactionId: string | null;
  createdAt: string;
};

export type CreatePaymentRequest = {
  bookingId: string;
  paymentMethod: string;
};
