import api from './api';

export const getIncidents = async () => {
  const response = await api.get('/incidents');
  return response.data.data;
};

export const createIncident = async (payload) => {
  const response = await api.post('/incidents', payload);
  return response.data.data;
};

export const updateIncident = async (id, payload) => {
  const response = await api.put(`/incidents/${id}`, payload);
  return response.data.data;
};

export const deleteIncident = async (id) => {
  const response = await api.delete(`/incidents/${id}`);
  return response.data.data;
};