import { Suspense } from "react";
import { CreateBookingForm } from "@/components/bookings/CreateBookingForm";
import { LoadingState } from "@/components/common/LoadingState";

export default function NewBookingPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <CreateBookingForm />
    </Suspense>
  );
}
