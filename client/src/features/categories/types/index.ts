export interface Category {
  id: string;
  _id?: string;
  name: string;
  description: string;
  imageUrl: string | null;
  image_public_id: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  image?: File | null;
}

export interface UpdateCategoryDto {
  id: string;
  name?: string;
  description?: string;
  image?: File | null;
}

export interface CategoryQuery {
  search?: string;
  sort?: 'asc' | 'desc';
  status?: 'active' | 'inactive' | 'all';
  page?: number;
  limit?: number;
}
