export type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "InProgress"
  | "ProviderCompleted"
  | "ClientConfirmed"
  | "Archived"
  | "Cancelled"
  | "Disputed"
  | "AwaitingPayment";

export type Booking = {
  id: string;
  status: BookingStatus;
  totalPrice: number;
  areaInHectares: number;
  createdAt: string;
  notes: string | null;
  serviceListingId: string;
  clientProfileId: string;
  providerProfileId: string;
  availabilityId: string;
  availabilityStart: string | null;
  availabilityEnd: string | null;
  clientName: string;
  listingTitle: string;
  paymentStatus: number | null;
  paymentAmount: number | null;
  paymentPlatformFee: number | null;
};

export type CreateBookingRequest = {
  serviceListingId: string;
  availabilityId: string;
  areaInHectares: number;
  notes?: string;
};

export type UpdateBookingStatusRequest = {
  status: BookingStatus;
};
