<template>
    <div class="user-profile">
      <h1>Thông tin cá nhân</h1>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Level:</strong> {{ user.level }}</p>
      <p><strong>EXP:</strong> {{ user.exp }}</p>
      <h2>Danh sách yêu thích</h2>
      <ul>
        <li v-for="manga in favorites" :key="manga._id">
          <router-link :to="`/manga/${manga._id}`">{{ manga.title }}</router-link>
        </li>
      </ul>
      <h2>Lịch sử đọc</h2>
      <ul>
        <li v-for="history in readingHistory" :key="history._id">
          {{ history.manga.title }} - {{ history.chapter.title }} ({{ history.readAt | formatDate }})
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import api from '../api';
  import moment from 'moment';
  
  export default {
    data() {
      return {
        user: {},
        favorites: [],
        readingHistory: []
      };
    },
    async created() {
      await this.fetchUser();
      await this.fetchFavorites();
      await this.fetchHistory();
    },
    filters: {
      formatDate(date) {
        return moment(date).format('DD/MM/YYYY HH:mm');
      }
    },
    methods: {
      async fetchUser() {
        try {
          const response = await api.getMe();
          this.user = response.data;
        } catch (err) {
          this.$toast.error('Lỗi khi tải thông tin user');
        }
      },
      async fetchFavorites() {
        try {
          const response = await api.getFavorites(this.user._id);
          this.favorites = response.data;
        } catch (err) {
          this.$toast.error('Lỗi khi tải danh sách yêu thích');
        }
      },
      async fetchHistory() {
        try {
          const response = await api.getHistory(this.user._id);
          this.readingHistory = response.data;
        } catch (err) {
          this.$toast.error('Lỗi khi tải lịch sử đọc');
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .user-profile {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    margin: 5px 0;
  }
  </style>