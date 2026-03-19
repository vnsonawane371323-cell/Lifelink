import axios from 'axios';

const api = axios.create({
  baseURL: 'https://lifelink-0ysg.onrender.com',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const generateInviteLink = async () => {
  const res = await api.post('/api/invite/generate');
  return res.data;
};

export const joinOrganization = async (token) => {
  const res = await api.post('/api/invite/join', { token });
  return res.data;
};

export const createBloodRequest = async (payload) => {
  const res = await api.post('/api/blood-requests/create', payload);
  return res.data;
};

export const getNearbyDonors = async ({ bloodGroup, lat, lng }) => {
  const res = await api.get('/api/donors/match', {
    params: { bloodGroup, lat, lng },
  });
  return res.data;
};

export default api;
