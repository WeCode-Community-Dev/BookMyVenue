import { api } from '../api/client.js';

// --- Amenities ---

export const getAdminAmenities = async () => {
  const res = await api.get('/admin/amenities');
  return res.data;
};

export const createAmenity = async (name) => {
  const res = await api.post('/admin/amenities', { name });
  return res.data;
};

export const updateAmenity = async (id, updates) => {
  const res = await api.patch(`/admin/amenities/${id}`, updates);
  return res.data;
};

export const deleteAmenity = async (id) => {
  const res = await api.del(`/admin/amenities/${id}`);
  return res.data;
};

// --- Categories ---

export const getAdminCategories = async () => {
  const res = await api.get('/admin/categories');
  return res.data;
};

export const createCategory = async (name) => {
  const res = await api.post('/admin/categories', { name });
  return res.data;
};

export const updateCategory = async (id, updates) => {
  const res = await api.patch(`/admin/categories/${id}`, updates);
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await api.del(`/admin/categories/${id}`);
  return res.data;
};
