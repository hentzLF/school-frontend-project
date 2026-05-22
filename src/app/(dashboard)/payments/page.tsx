import { Suspense } from "react";
import { PaymentList } from "@/components/payments/PaymentList";

export default function PaymentsPage() {
  return (
    <Suspense fallback={<p className="text-gray-500">Loading...</p>}>
      <PaymentList />
    </Suspense>
  );
}
