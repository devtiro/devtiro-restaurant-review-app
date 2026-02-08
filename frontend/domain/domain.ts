// Interface definitions
export interface Restaurant {
  id: string;
  name: string;
  cuisineType: string;
  contactInformation?: string;
  averageRating?: number;
  totalReviews?: number;
  reviews?: Review[];
  address: Address;
  geoLocation?: GeoLocation;
  operatingHours: OperatingHours;
  photos?: Photo[];
}

export interface RestaurantSummary {
  id: string;
  name: string;
  cuisineType: string;
  averageRating?: number;
  totalReviews?: number;
  address: Address;
  photos?: Photo[];
}

export interface Address {
  streetNumber: string;
  streetName: string;
  unit?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface OperatingHours {
  monday?: TimeRange;
  tuesday?: TimeRange;
  wednesday?: TimeRange;
  thursday?: TimeRange;
  friday?: TimeRange;
  saturday?: TimeRange;
  sunday?: TimeRange;
}

export interface TimeRange {
  openTime: string;
  closeTime: string;
}

export interface Review {
  id: string;
  content: string;
  rating: number;
  datePosted: string;
  lastEdited?: string;
  photos?: Photo[];
  writtenBy: UserSummary;
}

export interface Photo {
  id: string;
  url: string;
  caption?: string;
  uploadDate: string;
}

export interface UserSummary {
  id: string;
  username: string;
}

export interface PageMetadata {
  pageNumber: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: PageMetadata;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// Request interfaces
export interface CreateRestaurantRequest {
  name: string;
  cuisineType: string;
  contactInformation: string;
  address: Address;
  operatingHours: OperatingHours;
  photoIds: string[];
}

export interface UpdateRestaurantRequest {
  name?: string;
  cuisineType?: string;
  contactInformation?: string;
  address?: Address;
  operatingHours?: OperatingHours;
}

export interface CreateReviewRequest {
  content: string;
  rating: number;
  photoIds?: string[];
}

export interface UpdateReviewRequest {
  content: string;
  rating: number;
  photoIds?: string[];
}

export interface RestaurantSearchParams {
  q?: string;
  minRating?: number;
  latitude?: number;
  longitude?: number;
  radius?: number;
  page?: number;
  size?: number;
}
