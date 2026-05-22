export type Booking = {
  id: string;
  listingId: string;
  listingTitle: string;
  clientId: string;
  clientName: string;
  providerId: string;
  providerName: string;
  status: "Pending" | "Confirmed" | "InProgress" | "Completed" | "Cancelled";
  startDate: string;
  endDate: string;
  totalPrice: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateBookingRequest = {
  listingId: string;
  startDate: string;
  endDate: string;
  notes?: string;
};

export type UpdateBookingStatusRequest = {
  status: "Confirmed" | "InProgress" | "Completed" | "Cancelled";
};
