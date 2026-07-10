export interface CreateCategoryDto {
  name: string;
  description?: string;
  imageUrl?: string;
  image_public_id?: string;
}
export interface UpdateCategoryDto {
  id: string;
  name?: string;
  description?: string;
  imageUrl?: string;
  image_public_id?: string;
}
export interface CategoryResponseDto {
  id: string;
  name: string;
  description: string;
  imageUrl?: string | null;
  image_public_id?: string | null;
}

export interface GetCategoriesQueryDto {
  status?: 'active' | 'inactive' | 'all';
  search?: string;
  sort?: 'asc' | 'desc';
  page?: string | number;
  limit?: string | number;
}
