<template>
    <header class="header">
      <img src="../assets/logo.png" alt="Logo" class="logo" />
      <div class="search-bar">
        <input v-model="searchQuery" placeholder="Tìm kiếm truyện..." @keyup.enter="search" />
        <button @click="search">Tìm</button>
      </div>
      <div class="user-info">
        <span v-if="user">Level: {{ user.level }} | EXP: {{ user.exp }}</span>
        <router-link v-if="!user" to="/login">Đăng nhập</router-link>
        <router-link v-if="!user" to="/register">Đăng ký</router-link>
        <router-link v-if="user" to="/profile">Hồ sơ</router-link>
        <button v-if="user" @click="logout">Đăng xuất</button>
      </div>
    </header>
  </template>
  
  <script>
  import api from '../api';
  
  export default {
    name: 'Header',
    data() {
      return {
        user: null,
        searchQuery: ''
      };
    },
    async created() {
      await this.fetchUser();
    },
    methods: {
      async fetchUser() {
        try {
          const response = await api.getMe();
          this.user = response.data;
        } catch (err) {
          this.user = null;
        }
      },
      async search() {
        try {
          const response = await api.searchMangas({ q: this.searchQuery });
          this.$emit('search', response.data);
        } catch (err) {
          console.error('Lỗi khi tìm kiếm truyện', err);
        }
      },
      logout() {
        localStorage.removeItem('token');
        this.user = null;
        this.$router.push('/login');
      }
    }
  };
  </script>
  
  <style scoped>
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
  }
  .logo {
    height: 50px;
  }
  .search-bar {
    display: flex;
    align-items: center;
  }
  .search-bar input {
    padding: 8px;
    font-size: 16px;
    border: none;
    border-radius: 4px 0 0 4px;
  }
  .search-bar button {
    padding: 8px 12px;
    background-color: #ff4500;
    color: white;
    border: none;
    border-radius: 0 4px 4px 0;
    cursor: pointer;
  }
  .user-info a, .user-info button {
    margin-left: 10px;
    color: white;
    text-decoration: none;
    background: none;
    border: none;
    cursor: pointer;
  }
  .user-info button:hover, .user-info a:hover {
    text-decoration: underline;
  }
  </style>