import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Token sent:', token); // Thêm log để kiểm tra
  } else {
    console.log('No token found in localStorage');
  }
  return config;
}, error => Promise.reject(error));

api.interceptors.response.use(
  response => response,
  error => {
    console.log('API Error:', error.response?.data); // Log lỗi từ backend
    return Promise.reject(error);
  }
);

export default api;