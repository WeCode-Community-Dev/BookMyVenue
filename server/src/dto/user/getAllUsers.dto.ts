export interface getAllUsersDto {
  status?: 'active' | 'blocked' | 'all';
  search?: string;
  sort?: 'a-z' | 'z-a' | 'desc' | 'asc';
  role?: 'user' | 'owner' | 'admin' | 'all';
  page?: number;
  limit?: number;
}
