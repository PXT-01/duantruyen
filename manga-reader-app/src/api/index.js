import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default {
  // Auth
  register(data) { return api.post('/auth/register', data); },
  login(data) { return api.post('/auth/login', data); },
  getMe() { return api.get('/auth/me'); },

  // Mangas
  getMangas() { return api.get('/mangas'); },
  getManga(id) { return api.get(`/mangas/${id}`); },
  createManga(data) { return api.post('/mangas', data); },
  updateManga(id, data) { return api.put(`/mangas/${id}`, data); },
  deleteManga(id) { return api.delete(`/mangas/${id}`); },

  // Chapters
  getChapters(mangaId) { return api.get(`/chapters/${mangaId}`); },
  getChapter(chapterId) { return api.get(`/chapters/chapter/${chapterId}`); },
  getChapterPages(chapterId) { return api.get(`/chapters/${chapterId}/pages`); },
  createChapter(mangaId, data) { return api.post(`/chapters/${mangaId}`, data); },
  updateChapter(chapterId, data) { return api.put(`/chapters/chapter/${chapterId}`, data); },
  deleteChapter(chapterId) { return api.delete(`/chapters/chapter/${chapterId}`); },
  readChapter(chapterId) { return api.post(`/chapters/${chapterId}/read`); }, // Thêm

  // Pages
  createPage(chapterId, data) { return api.post(`/pages/${chapterId}`, data); },
  deletePage(pageId) { return api.delete(`/pages/${pageId}`); },

  // Users
  getUsers() { return api.get('/users/users'); },
  updateUserRole(id, data) { return api.put(`/users/users/${id}`, data); },
  toggleBlockUser(id, data) { return api.put(`/users/users/${id}/block`, data); },
  resetExp(id) { return api.put(`/users/users/${id}/reset-exp`); },
  updateLevel(id, data) { return api.put(`/users/users/${id}/level`, data); },
  getFavorites(id) { return api.get(`/users/users/${id}/favorites`); },
  getHistory(id) { return api.get(`/users/users/${id}/history`); },
  deleteUser(id) { return api.delete(`/users/users/${id}`); },

  // Comments
  getComments() { return api.get('/comments'); },
  deleteComment(id) { return api.delete(`/comments/${id}`); }
};