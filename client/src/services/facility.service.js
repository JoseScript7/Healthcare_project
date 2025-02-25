import api from './api';

export const getFacilities = async (params = {}) => {
  const response = await api.get('/facilities', { params });
  return response.data;
};

export const getFacilityById = async (id) => {
  const response = await api.get(`/facilities/${id}`);
  return response.data;
};

export const createFacility = async (facilityData) => {
  const response = await api.post('/facilities', facilityData);
  return response.data;
};

export const updateFacility = async (id, updates) => {
  const response = await api.put(`/facilities/${id}`, updates);
  return response.data;
};

export const deleteFacility = async (id) => {
  const response = await api.delete(`/facilities/${id}`);
  return response.data;
};

export const getFacilityUsers = async (facilityId) => {
  const response = await api.get(`/facilities/${facilityId}/users`);
  return response.data;
};

export const addFacilityUser = async (facilityId, userData) => {
  const response = await api.post(`/facilities/${facilityId}/users`, userData);
  return response.data;
};

export const removeFacilityUser = async (facilityId, userId) => {
  const response = await api.delete(`/facilities/${facilityId}/users/${userId}`);
  return response.data;
}; 