import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/manga-list',
    name: 'MangaList',
    component: () => import('../views/MangaList.vue')
  },
  {
    path: '/manga/:id',
    name: 'MangaDetail',
    component: () => import('../views/MangaDetail.vue')
  },
  {
    path: '/manga/:mangaId/chapter/:chapterId',
    name: 'Reader',
    component: () => import('../views/Reader.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue')
  },
  {
    path: '/admin/chapters/:mangaId',
    name: 'AdminChapters',
    component: () => import('../views/AdminChapters.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue')
  },
  {
    path: '/admin/chapters/:mangaId',
    name: 'AdminChapters',
    component: () => import('../views/AdminChapters.vue')
  },
  {
    path: '/admin/chapters/:mangaId/pages/:chapterId',
    name: 'AdminPages',
    component: () => import('../views/AdminPages.vue')
  }
];



const router = createRouter({
  history: createWebHistory(),
  routes
})


export default router