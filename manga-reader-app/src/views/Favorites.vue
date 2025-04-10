<template>
    <div class="favorites">
      <!-- Header -->
      <header class="header">
        <h1>Danh Sách Yêu Thích</h1>
        <button @click="$router.push('/')" class="back-btn">Quay lại</button>
      </header>
  
      <!-- Danh sách yêu thích -->
      <div class="manga-grid" v-if="favoriteMangas.length > 0">
        <div 
          v-for="manga in favoriteMangas" 
          :key="manga.id" 
          class="manga-item"
        >
          <img :src="manga.cover" :alt="manga.title" @click="goToManga(manga.id)" />
          <div class="manga-info">
            <p class="title">{{ manga.title }}</p>
            <small>Tác giả: {{ manga.author }}</small>
            <span class="status" :class="manga.status === 'Đang ra' ? 'ongoing' : 'completed'">
              {{ manga.status }}
            </span>
            <button @click="removeFromFavorites(manga.id)" class="remove-btn">Xóa</button>
          </div>
        </div>
      </div>
      <p v-else class="empty-message">Chưa có truyện nào trong danh sách yêu thích.</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FavoritesPage',
    data() {
      return {
        favoriteMangas: []
      }
    },
    created() {
      // Giả lập dữ liệu yêu thích (sau này sẽ lấy từ localStorage hoặc API)
      this.favoriteMangas = JSON.parse(localStorage.getItem('favorites')) || []
    },
    methods: {
      goToManga(id) {
        this.$router.push(`/manga/${id}`)
      },
      removeFromFavorites(id) {
        this.favoriteMangas = this.favoriteMangas.filter(manga => manga.id !== id)
        localStorage.setItem('favorites', JSON.stringify(this.favoriteMangas))
      }
    }
  }
  </script>
  
  <style scoped>
  .favorites {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  /* Header */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .header h1 {
    font-size: 24px;
    color: #e74c3c;
  }
  .back-btn {
    padding: 8px 16px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  /* Manga Grid */
  .manga-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 20px;
  }
  .manga-item {
    position: relative;
    cursor: pointer;
    transition: transform 0.2s;
  }
  .manga-item:hover {
    transform: translateY(-5px);
  }
  .manga-item img {
    width: 100%;
    height: 220px;
    object-fit: cover;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
  .manga-info {
    text-align: center;
    margin-top: 5px;
  }
  .title {
    font-weight: bold;
    margin: 5px 0;
    color: #333;
  }
  .manga-info small {
    color: #777;
  }
  .status {
    display: block;
    font-size: 12px;
    margin-top: 3px;
  }
  .status.ongoing {
    color: #e74c3c;
  }
  .status.completed {
    color: #2ecc71;
  }
  .remove-btn {
    margin-top: 5px;
    padding: 5px 10px;
    background-color: #e74c3c;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .remove-btn:hover {
    background-color: #c0392b;
  }
  
  /* Empty Message */
  .empty-message {
    text-align: center;
    color: #777;
    font-size: 18px;
  }
  </style>