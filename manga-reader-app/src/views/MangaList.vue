<template>
  <div class="manga-list">
    <h1>Danh sách truyện</h1>
    <div class="filters">
      <select v-model="genreFilter">
        <option value="">Tất cả thể loại</option>
        <option value="Hành động">Hành động</option>
        <option value="Hài hước">Hài hước</option>
        <option value="Lãng mạn">Lãng mạn</option>
      </select>
      <select v-model="sortBy">
        <option value="title">Tên</option>
        <option value="views">Lượt xem</option>
        <option value="createdAt">Mới nhất</option>
      </select>
    </div>
    <div class="manga-grid">
      <div v-for="manga in filteredMangas" :key="manga._id" class="manga-item">
        <router-link :to="`/manga/${manga._id}`">
          <img :src="manga.cover" :alt="manga.title" />
          <h3>{{ manga.title }}</h3>
          <p>Chương mới: {{ manga.chapterCount || 'Chưa có' }}</p>
        </router-link>
      </div>
    </div>
    <div class="pagination">
      <button :disabled="currentPage === 1" @click="currentPage--"><</button>
      <span>Trang {{ currentPage }} / {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="currentPage++">></button>
    </div>
  </div>
</template>

<script>
import api from '../api';

export default {
  data() {
    return {
      mangas: [],
      genreFilter: '',
      sortBy: 'title',
      currentPage: 1,
      itemsPerPage: 12
    };
  },
  computed: {
    filteredMangas() {
      let filtered = [...this.mangas];
      if (this.genreFilter) {
        filtered = filtered.filter(manga => manga.genre === this.genreFilter);
      }
      if (this.sortBy === 'title') {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
      } else if (this.sortBy === 'views') {
        filtered.sort((a, b) => b.views - a.views);
      } else if (this.sortBy === 'createdAt') {
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      return filtered.slice(
        (this.currentPage - 1) * this.itemsPerPage,
        this.currentPage * this.itemsPerPage
      );
    },
    totalPages() {
      return Math.ceil(this.mangas.length / this.itemsPerPage);
    }
  },
  async created() {
    await this.fetchMangas();
  },
  methods: {
    async fetchMangas() {
      try {
        const response = await api.getMangas();
        this.mangas = response.data;
      } catch (err) {
        console.error('Lỗi khi tải danh sách truyện', err);
      }
    }
  }
};
</script>

<style scoped>
.manga-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
}
.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.filters select {
  padding: 8px;
  font-size: 16px;
  border-radius: 4px;
}
.manga-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
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
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}
.pagination button {
  padding: 8px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>