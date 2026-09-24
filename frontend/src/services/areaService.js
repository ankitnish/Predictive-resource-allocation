import api from './api';

export const getAreas = async () => {
  const response = await api.get('/areas');
  return response.data.data;
};