import api from './api';

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data.data; // { token, user }
};

export const register = async (fullName, email, password, role) => {
  const response = await api.post('/auth/register', { fullName, email, password, role });
  return response.data.data;
};