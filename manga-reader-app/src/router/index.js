import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import MangaList from '../views/MangaList.vue';
import MangaDetail from '../views/MangaDetail.vue';
import Reader from '../views/Reader.vue';
import ChapterReader from '../views/ChapterReader.vue';
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import AdminPage from '../views/AdminPage.vue'; // Thêm import
import AdminChapters from '../views/AdminChapters.vue';
import AdminPages from '../views/AdminPages.vue';
import AdminUsers from '../views/AdminUsers.vue';
import AdminComments from '../views/AdminComments.vue'; // Đã thêm trước đó
import UserProfile from '../views/UserProfile.vue'; // Đã thêm trước đó

Vue.use(VueRouter);

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/manga-list', name: 'MangaList', component: MangaList },
  { path: '/manga/:id', name: 'MangaDetail', component: MangaDetail },
  { path: '/manga/:mangaId/chapter/:chapterId', name: 'Reader', component: Reader },
  { path: '/chapter/:chapterId', name: 'ChapterReader', component: ChapterReader },
  { path: '/register', name: 'Register', component: Register },
  { path: '/login', name: 'Login', component: Login },
  { path: '/admin', name: 'Admin', component: AdminPage }, // Đã sửa
  { path: '/admin/chapters/:mangaId', name: 'AdminChapters', component: AdminChapters },
  { path: '/admin/chapters/:mangaId/pages/:chapterId', name: 'AdminPages', component: AdminPages },
  { path: '/admin/users', name: 'AdminUsers', component: AdminUsers },
  { path: '/admin/comments', name: 'AdminComments', component: AdminComments },
  { path: '/profile', name: 'UserProfile', component: UserProfile }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;