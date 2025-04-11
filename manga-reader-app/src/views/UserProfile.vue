<template>
    <div class="user-profile">
      <h1>Thông Tin Người Dùng</h1>
      <div class="user-info">
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Cấp độ:</strong> {{ user.level }}</p>
        <p><strong>EXP:</strong> {{ user.exp }}</p>
      </div>
  
      <section>
        <h2>Truyện Yêu Thích</h2>
        <div v-if="user.favorites?.length" class="manga-grid">
          <div 
            v-for="manga in user.favorites" 
            :key="manga.id" 
            class="manga-item"
            @click="$router.push(`/manga/${manga.id}`)"
          >
            <img :src="getImageUrl(manga.cover)" :alt="manga.title" />
            <p>{{ manga.title }}</p>
          </div>
        </div>
        <p v-else>Chưa có truyện yêu thích.</p>
      </section>
  
      <section>
        <h2>Lịch Sử Đọc</h2>
        <ul v-if="user.readingHistory?.length" class="history-list">
          <li v-for="history in user.readingHistory" :key="history._id">
            {{ history.manga.title }} - {{ history.chapter.title }} 
            ({{ new Date(history.readAt).toLocaleString() }})
          </li>
        </ul>
        <p v-else>Chưa có lịch sử đọc.</p>
      </section>
    </div>
  </template>
  
  <script>
  import api from '../api';
  import { useToast } from 'vue-toastification';
  
  export default {
    name: 'UserProfilePage',
    setup() {
      const toast = useToast();
      return { toast };
    },
    data() {
      return {
        user: {
          email: '',
          level: 1,
          exp: 0,
          favorites: [],
          readingHistory: []
        }
      };
    },
    async created() {
      try {
        const response = await api.get('/auth/me');
        this.user = response.data;
      } catch (err) {
        this.toast.error('Lỗi khi lấy thông tin người dùng');
        this.$router.push('/login');
      }
    },
    methods: {
      getImageUrl(cover) {
        return cover ? `http://localhost:5000${cover}` : '';
      }
    }
  };
  </script>
  
  <style scoped>
  .user-profile {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  .user-info {
    background: #f9f9f9;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  .user-info p {
    margin: 10px 0;
  }
  .manga-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 20px;
  }
  .manga-item {
    cursor: pointer;
  }
  .manga-item img {
    width: 100%;
    height: 220px;
    object-fit: cover;
    border-radius: 5px;
  }
  .history-list {
    list-style: none;
    padding: 0;
  }
  .history-list li {
    padding: 10px;
    background: #f9f9f9;
    margin-bottom: 5px;
    border-radius: 4px;
  }
  </style>