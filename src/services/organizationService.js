import api from './api';

export const registerOrganization = async (payload) => {
  const response = await api.post('/api/organizations/register', payload);
  return response.data;
};

export const verifyInviteCode = async (code) => {
  const response = await api.get(`/api/organizations/invite/${encodeURIComponent(code)}`);
  return response.data;
};
