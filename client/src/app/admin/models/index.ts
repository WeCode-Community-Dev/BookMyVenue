export * from '../../shared/models/user.model';
export * from '../../shared/models/vendor.model';
export * from '../../shared/models/venue.model';
export * from '../../shared/models/booking.model';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
}
