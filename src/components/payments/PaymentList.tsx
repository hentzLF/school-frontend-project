"use client";

import { usePayments, useCreatePayment } from "@/hooks/usePayments";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import type { Payment } from "@/types/payment";

const statusColors: Record<Payment["status"], string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Completed: "bg-green-100 text-green-800",
  Failed: "bg-red-100 text-red-800",
  Refunded: "bg-gray-100 text-gray-800",
};

export function PaymentList() {
  const { data: payments, isLoading, error } = usePayments();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const createPayment = useCreatePayment();
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");

  const handleCreatePayment = async () => {
    if (!bookingId) return;
    try {
      await createPayment.mutateAsync({ bookingId, paymentMethod });
    } catch {
      // Error captured by mutation
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Payments</h1>

      {bookingId && (
        <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Process Payment</h2>
          <div className="flex items-end gap-3">
            <div>
              <label
                htmlFor="paymentMethod"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Payment Method
              </label>
              <select
                id="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="bank_transfer">Bank Transfer</option>
                <option value="credit_card">Credit Card</option>
                <option value="cash">Cash</option>
              </select>
            </div>
            <button
              onClick={handleCreatePayment}
              disabled={createPayment.isPending}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {createPayment.isPending ? "Processing..." : "Pay Now"}
            </button>
          </div>
          {createPayment.error && (
            <p role="alert" className="mt-2 text-sm text-red-600">
              Payment failed. Please try again.
            </p>
          )}
        </div>
      )}

      {isLoading && <p className="text-gray-500">Loading payments...</p>}

      {error && (
        <div
          role="alert"
          className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700"
        >
          Failed to load payments.
        </div>
      )}

      {payments && payments.length === 0 && (
        <p className="text-gray-500">No payments yet.</p>
      )}

      {payments && payments.length > 0 && (
        <div className="space-y-3">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="border border-gray-200 rounded-lg p-4 bg-white flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Booking: {payment.bookingId.slice(0, 8)}...
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {payment.paymentMethod} —{" "}
                  {new Date(payment.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[payment.status]}`}
                >
                  {payment.status}
                </span>
                <span className="text-sm font-bold text-gray-900">
                  {payment.amount.toFixed(2)} {payment.currency}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
