export interface Vendor {
  id: string;
  email: string;
  businessName: string;
  contactPerson: string;
  phone: string;
  address: string;
  logo: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVendorRequest {
  email: string;
  password: string;
  businessName: string;
  contactPerson: string;
  phone: string;
  address: string;
}

export interface UpdateVendorRequest {
  businessName?: string;
  contactPerson?: string;
  phone?: string;
  address?: string;
  logo?: string;
}
