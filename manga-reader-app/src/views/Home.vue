<template>
  <div class="home">
    <header class="header">
      <h1 class="logo">Manga Reader</h1>
      <div>
        <span v-if="isLoggedIn" class="user-info">Level: {{ user.level }} | EXP: {{ user.exp }}</span>
        <router-link to="/manga-list" class="nav-link">Danh sách truyện</router-link>
        <router-link to="/favorites" class="nav-link">Yêu thích</router-link>
        <router-link to="/profile" class="nav-link">Hồ sơ</router-link>
        <router-link v-if="isAdmin" to="/admin" class="nav-link">Quản lý</router-link>
        <span v-if="isLoggedIn" class="nav-link" @click="logout">Đăng xuất</span>
        <template v-else>
          <router-link to="/login" class="nav-link">Đăng nhập</router-link>
          <router-link to="/register" class="nav-link">Đăng ký</router-link>
        </template>
        <div class="search-bar">
          <input 
            v-model="searchQuery" 
            placeholder="Tìm kiếm truyện..." 
            @keyup.enter="searchManga"
          />
          <button @click="searchManga"><i class="fas fa-search"></i></button>
        </div>
      </div>
    </header>

    <section class="genres-section">
      <h2>Thể Loại</h2>
      <div class="genre-list">
        <span 
          v-for="genre in genres" 
          :key="genre" 
          :class="{ 'active': selectedGenre === genre }"
          @click="filterByGenre(genre)"
          class="genre-tag"
        >
          {{ genre }}
        </span>
      </div>
    </section>

    <section class="manga-section">
      <h2>Truyện Mới Cập Nhật</h2>
      <div class="manga-grid">
        <div 
          v-for="manga in filteredMangas" 
          :key="manga.id" 
          class="manga-item"
          @click="goToManga(manga.id)"
        >
          <img :src="getImageUrl(manga.cover)" :alt="manga.title" />
          <div class="manga-info">
            <p class="title">{{ manga.title }}</p>
            <small>{{ manga.author }}</small>
            <span class="status" :class="manga.status === 'Ongoing' ? 'ongoing' : 'completed'">
              {{ manga.status }}
            </span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import api from '../api';

export default {
  name: 'HomePage',
  data() {
    return {
      searchQuery: '',
      selectedGenre: '',
      genres: [],
      mangas: [],
      user: { level: 1, exp: 0 }
    };
  },
  computed: {
    isAdmin() {
      const token = localStorage.getItem('token');
      if (!token) return false;
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return decoded.role === 'admin';
    },
    filteredMangas() {
      let result = this.mangas;
      if (this.selectedGenre) {
        result = result.filter(manga => manga.genre === this.selectedGenre);
      }
      if (this.searchQuery) {
        result = result.filter(manga => 
          manga.title.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      return result;
    },
    isLoggedIn() {
      return !!localStorage.getItem('token');
    }
  },
  async created() {
    try {
      const [mangaResponse, userResponse] = await Promise.all([
        api.get('/mangas'),
        this.isLoggedIn ? api.get('/auth/me') : Promise.resolve(null)
      ]);
      this.mangas = mangaResponse.data;
      this.genres = [...new Set(mangaResponse.data.map(m => m.genre).filter(g => g))];
      if (userResponse) {
        this.user = userResponse.data;
      }
    } catch (err) {
      console.error('Lỗi khi lấy dữ liệu:', err);
    }
  },
  methods: {
    searchManga() {
      console.log('Tìm kiếm:', this.searchQuery);
    },
    filterByGenre(genre) {
      this.selectedGenre = this.selectedGenre === genre ? '' : genre;
    },
    goToManga(id) {
      this.$router.push(`/manga/${id}`);
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('favorites');
      this.user = { level: 1, exp: 0 };
      this.$router.push('/login');
    },
    getImageUrl(cover) {
      return cover ? `http://localhost:5000${cover}` : '';
    }
  }
};
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}
.logo {
  font-size: 24px;
  font-weight: bold;
  color: #e74c3c;
}
.user-info {
  margin-right: 20px;
  color: #333;
}
.search-bar {
  display: flex;
  align-items: center;
}
.search-bar input {
  padding: 8px;
  width: 250px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
}
.search-bar button {
  padding: 8px 12px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.genres-section {
  margin: 20px 0;
}
.genre-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.genre-tag {
  padding: 6px 12px;
  background-color: #f1f1f1;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.genre-tag:hover, .genre-tag.active {
  background-color: #e74c3c;
  color: white;
}

.manga-section h2 {
  margin-bottom: 15px;
  color: #333;
}
.manga-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
}
.manga-item {
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
.nav-link {
  margin-right: 20px;
  text-decoration: none;
  color: #e74c3c;
  font-weight: bold;
  cursor: pointer;
}
.nav-link:hover {
  text-decoration: underline;
}
</style>