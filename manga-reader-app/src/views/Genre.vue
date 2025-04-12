<template>
    <div class="genre-page">
      <h1>Truyện thể loại {{ genre }}</h1>
      <div class="manga-grid">
        <div v-for="manga in genreMangas" :key="manga._id" class="manga-item">
          <router-link :to="`/manga/${manga._id}`">
            <img :src="manga.cover" :alt="manga.title" />
            <h3>{{ manga.title }}</h3>
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import api from '../api';
  
  export default {
    data() {
      return {
        genreMangas: [],
        genre: ''
      };
    },
    async created() {
      this.genre = this.$route.params.genre;
      await this.fetchGenreMangas();
    },
    methods: {
      async fetchGenreMangas() {
        try {
          const response = await api.searchMangas({ genre: this.genre });
          this.genreMangas = response.data;
        } catch (err) {
          console.error('Lỗi khi tải truyện theo thể loại', err);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .genre-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
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
  </style>