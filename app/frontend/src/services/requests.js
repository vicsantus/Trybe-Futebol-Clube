import axios from 'axios';

const PROTOCOL = process.env.REACT_APP_API_PROTOCOL || 'http';
const HOST = process.env.REACT_APP_API_HOST || `localhost:${process.env.REACT_APP_API_PORT || '3001'}`

const api = axios.create({
  baseURL: `${PROTOCOL}://${HOST}`,
});

export const setToken = (token) => {
  api.defaults.headers.common.Authorization = token;
};

export const requestData = async (endpoint) => {
  const { data } = await api.get(endpoint);
  return data;
};

export const requestLogin = async (endpoint, body) => {
  const { data } = await api.post(endpoint, body);
  return data;
};

export default api;
