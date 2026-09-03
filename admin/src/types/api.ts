import type {
  User,
  Owner,
  Admin,
  Venue,
  MyVenue,
  Booking,
  Review,
  Log,
  MonthData,
} from "./models";

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface BasePaginatedResponse {
  pagination: {
    totalPages: number;
    currentPage: number;
  };
}

export interface UsersResponse extends BasePaginatedResponse {
  users: User[];
}

export interface OwnersResponse extends BasePaginatedResponse {
  owners: Owner[];
}

export interface AdminsResponse extends BasePaginatedResponse {
  admins: Admin[];
}

export interface VenuesResponse extends BasePaginatedResponse {
  venues: Venue[];
}

export interface BookingsResponse extends BasePaginatedResponse {
  bookings: Booking[];
}

export interface ReviewsResponse extends BasePaginatedResponse {
  reviews: Review[];
}

export interface LogsResponse extends BasePaginatedResponse {
  logs: Log[];
}

export interface MyVenuesResponse {
  data: MyVenue[];
}

export interface AnalyticsResponse {
  totalRevenue: number;
  totalBookings: number;
  monthlyData: MonthData[];
}

export interface AvailabilityResponse {
  bookedDates: string[];
  blockedDates: string[];
  workingDays: string[];
  temporaryBlockAfterDate?: string | null;
  inactivityBlockedAfterDate?: string | null;
}
