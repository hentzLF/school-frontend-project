export type Listing = {
  id: string;
  title: string;
  categoryName: string;
  providerName: string;
  pricePerHectare: number;
  isActive: boolean;
  averageRating: number;
  reviewCount: number;
};

export type ListingLocation = {
  municipalityId: string;
  municipalityName: string;
  countyId: string;
  countyName: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
};

export type ListingDetail = {
  id: string;
  title: string;
  description: string | null;
  pricePerHectare: number;
  isActive: boolean;
  userProfileId: string;
  serviceCategoryId: string;
  location: ListingLocation | null;
  categoryName: string;
  providerName: string;
  providerUserId: string | null;
  averageRating: number;
  reviewCount: number;
};

export type CreateListingRequest = {
  title: string;
  description: string;
  pricePerHectare: number;
  serviceCategoryId: string;
  location?: { municipalityId: string };
};

export type UpdateListingRequest = Partial<CreateListingRequest> & {
  isActive?: boolean;
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
