import { BookingDetail } from "@/components/bookings/BookingDetail";

type BookingPageProps = {
  params: Promise<{ id: string }>;
};

export default async function BookingPage({ params }: BookingPageProps) {
  const { id } = await params;
  return <BookingDetail bookingId={id} />;
}
