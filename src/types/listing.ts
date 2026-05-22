export type Listing = {
  id: string;
  title: string;
  description: string;
  price: number;
  priceUnit: string;
  categoryId: string;
  categoryName: string;
  countyId: string;
  countyName: string;
  providerId: string;
  providerName: string;
  status: "Active" | "Inactive" | "Draft";
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateListingRequest = {
  title: string;
  description: string;
  price: number;
  priceUnit: string;
  categoryId: string;
  countyId: string;
};

export type UpdateListingRequest = Partial<CreateListingRequest> & {
  status?: "Active" | "Inactive" | "Draft";
};

export type ListingFilters = {
  search?: string;
  categoryId?: string;
  countyId?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
};
