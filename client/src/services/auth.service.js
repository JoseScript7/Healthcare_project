import api from './api';

export const login = async (email, password) => {
  try {
    console.log('Attempting login with:', { email });
    const response = await api.post('/api/auth/login', { email, password });
    console.log('Login response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login service error:', error);
    throw error;
  }
};

export const register = async (userData) => {
  const response = await api.post('/api/auth/register', userData);
  return response.data;
};

export const logout = async () => {
  await api.post('/api/auth/logout');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getProfile = async () => {
  const response = await api.get('/api/auth/profile');
  return response.data;
}; 