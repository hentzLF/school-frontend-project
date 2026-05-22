import { Suspense } from "react";
import { CreateBookingForm } from "@/components/bookings/CreateBookingForm";

export default function NewBookingPage() {
  return (
    <Suspense fallback={<p className="text-gray-500">Loading...</p>}>
      <CreateBookingForm />
    </Suspense>
  );
}
