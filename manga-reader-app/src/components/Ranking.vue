<template>
    <div class="ranking">
      <h2>Bảng xếp hạng</h2>
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
  </template>
  
  <script>
  export default {
    props: {
      ranking: {
        type: Array,
        required: true
      }
    }
  };
  </script>
  
  <style scoped>
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
  .rank {
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
  .info h3 {
    font-size: 16px;
    margin: 0;
  }
  .info p {
    font-size: 14px;
    color: #666;
    margin: 5px 0 0;
  }
  </style>