import api from './api';

export const getResources = async () => {
  const response = await api.get('/resources');
  return response.data.data;
};

export const createResource = async (payload) => {
  const response = await api.post('/resources', payload);
  return response.data.data;
};

export const updateResource = async (id, payload) => {
  const response = await api.put(`/resources/${id}`, payload);
  return response.data.data;
};

export const deleteResource = async (id) => {
  const response = await api.delete(`/resources/${id}`);
  return response.data.data;
};