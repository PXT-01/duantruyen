<template>
  <div class="home">
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
    <div class="content">
      <h2>Truyện nổi bật</h2>
      <VueSlickCarousel v-bind="carouselSettings">
        <div v-for="manga in featuredMangas" :key="manga._id" class="carousel-item">
          <router-link :to="`/manga/${manga._id}`">
            <img :src="manga.cover" :alt="manga.title" />
            <h3>{{ manga.title }}</h3>
          </router-link>
        </div>
      </VueSlickCarousel>
      <h2>Truyện mới cập nhật</h2>
      <div class="manga-grid">
        <div v-for="manga in mangas" :key="manga._id" class="manga-item">
          <router-link :to="`/manga/${manga._id}`">
            <img :src="manga.cover" :alt="manga.title" />
            <h3>{{ manga.title }}</h3>
            <p>Chương mới: {{ manga.chapterCount || 'Chưa có' }}</p>
          </router-link>
        </div>
      </div>
      <h2>Bảng xếp hạng</h2>
      <div class="ranking">
        <div v-for="(manga, index) in ranking" :key="manga._id" class="ranking-item">
          <span class="rank">{{ index + 1 }}</span>
          <router-link :to="`/manga/${manga._id}`">
            <img :src="manga.cover" :alt="manga.title" />
            <div class="info">
              <h3>{{ manga.title }}</h3>
              <p>Lượt xem: {{ manga.views }}</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api';
import VueSlickCarousel from 'vue-slick-carousel';
import 'vue-slick-carousel/dist/vue-slick-carousel.css';
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css';

export default {
  components: { VueSlickCarousel },
  data() {
    return {
      user: null,
      mangas: [],
      featuredMangas: [],
      ranking: [],
      searchQuery: '',
      carouselSettings: {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000
      }
    };
  },
  async created() {
    await this.fetchUser();
    await this.fetchMangas();
    await this.fetchFeaturedMangas();
    await this.fetchRanking();
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
    async fetchMangas() {
      try {
        const response = await api.getMangas();
        this.mangas = response.data;
      } catch (err) {
        console.error('Lỗi khi tải danh sách truyện', err);
      }
    },
    async fetchFeaturedMangas() {
      try {
        const response = await api.getFeaturedMangas();
        this.featuredMangas = response.data;
      } catch (err) {
        console.error('Lỗi khi tải truyện nổi bật', err);
      }
    },
    async fetchRanking() {
      try {
        const response = await api.getRanking();
        this.ranking = response.data;
      } catch (err) {
        console.error('Lỗi khi tải bảng xếp hạng', err);
      }
    },
    async search() {
      try {
        const response = await api.searchMangas({ q: this.searchQuery });
        this.mangas = response.data;
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
.home {
  font-family: 'Roboto', sans-serif;
}
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
.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
.carousel-item img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}
.carousel-item h3 {
  font-size: 18px;
  margin: 10px 0;
  text-align: center;
}
.manga-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}
.manga-item img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}
.manga-item h3 {
  font-size: 16px;
  margin: 10px 0 5px;
}
.manga-item p {
  font-size: 14px;
  color: #666;
}
.manga-item:hover {
  transform: translateY(-5px);
  transition: transform 0.2s;
}
.ranking {
  max-width: 600px;
  margin: 0 auto;
}
.ranking-item {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 10px;
}
.ranking-item .rank {
  width: 30px;
  font-size: 18px;
  font-weight: bold;
  color: #ff4500;
}
.ranking-item img {
  width: 60px;
  height: auto;
  border-radius: 4px;
  margin-right: 10px;
}
.ranking-item .info h3 {
  font-size: 16px;
  margin: 0;
}
.ranking-item .info p {
  font-size: 14px;
  color: #666;
  margin: 5px 0 0;
}
.ranking-item:hover {
  background-color: #e9ecef;
}
</style>