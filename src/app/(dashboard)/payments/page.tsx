import { Suspense } from "react";
import { PaymentList } from "@/components/payments/PaymentList";
import { LoadingState } from "@/components/common/LoadingState";

export default function PaymentsPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <PaymentList />
    </Suspense>
  );
}
