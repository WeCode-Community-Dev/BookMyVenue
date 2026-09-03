export interface Admin {
  [key: string]: unknown;
  _id: string;
  username: string;
  email: string;
  active: boolean;
  createdAt: string;
}

export interface AdminsResponse {
  admins: Admin[];
  pagination: { totalPages: number; currentPage: number };
}
