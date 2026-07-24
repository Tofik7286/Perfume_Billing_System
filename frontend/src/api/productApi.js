import axiosClient from './axiosClient';

export const fetchProducts = async (params = {}) => {
  const response = await axiosClient.get('/api/v1/products/', { params });
  return response.data;
};

export const fetchProductById = async (id) => {
  const response = await axiosClient.get(`/api/v1/products/${id}/`);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await axiosClient.post('/api/v1/products/', productData);
  return response.data;
};

export const updateProduct = async ({ id, ...productData }) => {
  const response = await axiosClient.put(`/api/v1/products/${id}/`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axiosClient.delete(`/api/v1/products/${id}/`);
  return response.data;
};
