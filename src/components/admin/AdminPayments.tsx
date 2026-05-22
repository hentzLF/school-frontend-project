"use client";

import { useAdminPayments } from "@/hooks/useAdmin";
import type { Payment } from "@/types/payment";

const statusColors: Record<Payment["status"], string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Completed: "bg-green-100 text-green-800",
  Failed: "bg-red-100 text-red-800",
  Refunded: "bg-gray-100 text-gray-800",
};

export function AdminPayments() {
  const { data: payments, isLoading, error } = useAdminPayments();

  if (isLoading) return <p className="text-gray-500">Loading payments...</p>;
  if (error) {
    return (
      <div
        role="alert"
        className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700"
      >
        Failed to load payments.
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Payment Management
      </h1>

      {!payments || payments.length === 0 ? (
        <p className="text-gray-500">No payments found.</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Transaction
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Method
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Amount
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Status
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-4 py-3 text-gray-900 font-mono text-xs">
                    {payment.transactionId ?? payment.id.slice(0, 12)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {payment.paymentMethod}
                  </td>
                  <td className="px-4 py-3 text-gray-900 font-medium">
                    {payment.amount.toFixed(2)} {payment.currency}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${statusColors[payment.status]}`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
