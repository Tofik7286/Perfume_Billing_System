import axiosClient from './axiosClient';

const toApiPayload = (formData) => ({
  party_name: formData.name,
  mobile_number: formData.phone,
  alternate_mobile: formData.alternatePhone || null,
  email_address: formData.email || null,
  gst_number: formData.gstNumber || null,
  pan_number: formData.panNumber || null,
  address_line_1: formData.addressLine1 || null,
  address_line_2: formData.addressLine2 || null,
  landmark: formData.landmark || null,
  city: formData.city || null,
  state: formData.state || null,
  pincode: formData.pincode || null,
  country: formData.country || 'India',
});

export const fetchParties = async (params = {}) => {
  const response = await axiosClient.get('/api/v1/parties/', { params });
  return response.data;
};

export const fetchPartyById = async (id) => {
  const response = await axiosClient.get(`/api/v1/parties/${id}/`);
  return response.data;
};

export const createParty = async (formData) => {
  const payload = toApiPayload(formData);
  const response = await axiosClient.post('/api/v1/parties/', payload);
  return response.data;
};

export const updateParty = async ({ id, ...formData }) => {
  const payload = toApiPayload(formData);
  const response = await axiosClient.put(`/api/v1/parties/${id}/`, payload);
  return response.data;
};

export const deleteParty = async (id) => {
  const response = await axiosClient.delete(`/api/v1/parties/${id}/`);
  return response.data;
};
