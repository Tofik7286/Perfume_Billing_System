import axiosClient from './axiosClient';

export const loginUser = async ({ username, password }) => {
  const response = await axiosClient.post('/api/v1/auth/token/', { username, password });
  return response.data;
};

export const refreshToken = async (refresh) => {
  const response = await axiosClient.post('/api/v1/auth/token/refresh/', { refresh });
  return response.data;
};

export const getMe = async () => {
  const response = await axiosClient.get('/api/v1/auth/me/');
  return response.data;
};
