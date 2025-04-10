<template>
    <div class="manga-list">
      <!-- Header -->
      <header class="header">
        <h1>Danh Sách Truyện</h1>
        <div class="search-bar">
          <input 
            v-model="searchQuery" 
            placeholder="Tìm kiếm truyện..." 
            @keyup.enter="searchManga"
          />
          <button @click="searchManga"><i class="fas fa-search"></i></button>
        </div>
      </header>
  
      <!-- Bộ lọc -->
      <div class="filters">
        <div class="filter-group">
          <label>Thể loại:</label>
          <select v-model="selectedGenre" @change="applyFilters">
            <option value="">Tất cả</option>
            <option v-for="genre in genres" :key="genre" :value="genre">{{ genre }}</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Trạng thái:</label>
          <select v-model="selectedStatus" @change="applyFilters">
            <option value="">Tất cả</option>
            <option value="Đang ra">Đang ra</option>
            <option value="Hoàn thành">Hoàn thành</option>
          </select>
        </div>
      </div>
  
      <!-- Danh sách truyện -->
      <div class="manga-grid">
        <div 
          v-for="manga in paginatedMangas" 
          :key="manga.id" 
          class="manga-item"
          @click="goToManga(manga.id)"
        >
          <img :src="manga.cover" :alt="manga.title" />
          <div class="manga-info">
            <p class="title">{{ manga.title }}</p>
            <small>Tác giả: {{ manga.author }}</small>
            <span class="status" :class="manga.status === 'Đang ra' ? 'ongoing' : 'completed'">
              {{ manga.status }}
            </span>
          </div>
        </div>
      </div>
  
      <!-- Phân trang -->
      <div class="pagination">
        <button 
          @click="changePage(currentPage - 1)" 
          :disabled="currentPage === 1"
        >
          Trang trước
        </button>
        <span>Trang {{ currentPage }} / {{ totalPages }}</span>
        <button 
          @click="changePage(currentPage + 1)" 
          :disabled="currentPage === totalPages"
        >
          Trang sau
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import api from '../api';
  
  export default {
    name: 'MangaListPage',
    data() {
      return {
        searchQuery: '',
        selectedGenre: '',
        selectedStatus: '',
        currentPage: 1,
        itemsPerPage: 8,
        genres: [],
        mangas: []
      }
    },
    computed: {
      filteredMangas() {
        let result = this.mangas;
        if (this.selectedGenre) {
          result = result.filter(manga => manga.genre === this.selectedGenre);
        }
        if (this.selectedStatus) {
          result = result.filter(manga => manga.status === this.selectedStatus);
        }
        if (this.searchQuery) {
          result = result.filter(manga => 
            manga.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            manga.author.toLowerCase().includes(this.searchQuery.toLowerCase())
          );
        }
        return result;
      },
      totalPages() {
        return Math.ceil(this.filteredMangas.length / this.itemsPerPage);
      },
      paginatedMangas() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.filteredMangas.slice(start, end);
      }
    },
    async created() {
      try {
        const response = await api.get('/mangas');
        this.mangas = response.data;
        this.genres = [...new Set(response.data.map(m => m.genre))];
      } catch (err) {
        console.error('Lỗi khi lấy danh sách truyện:', err);
      }
    },
    methods: {
      searchManga() {
        this.currentPage = 1;
      },
      applyFilters() {
        this.currentPage = 1;
      },
      changePage(page) {
        if (page >= 1 && page <= this.totalPages) {
          this.currentPage = page;
        }
      },
      goToManga(id) {
        this.$router.push(`/manga/${id}`);
      }
    }
  }
  </script>
  
  <style scoped>
  .manga-list {
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
  
  /* Filters */
  .filters {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
  }
  .filter-group {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .filter-group label {
    font-weight: bold;
  }
  .filter-group select {
    padding: 6px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  /* Manga Grid */
  .manga-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
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
  
  /* Pagination */
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }
  .pagination button {
    padding: 8px 16px;
    background-color: #e74c3c;
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