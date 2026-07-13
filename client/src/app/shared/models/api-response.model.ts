export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface PaginationResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}


export interface SpringPage<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}
