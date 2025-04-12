<template>
    <div class="carousel">
      <VueSlickCarousel v-bind="settings">
        <div v-for="manga in featuredMangas" :key="manga._id">
          <router-link :to="`/manga/${manga._id}`">
            <img :src="manga.cover" :alt="manga.title" />
            <h3>{{ manga.title }}</h3>
          </router-link>
        </div>
      </VueSlickCarousel>
    </div>
  </template>
  
  <script>
  import VueSlickCarousel from 'vue-slick-carousel';
  import 'vue-slick-carousel/dist/vue-slick-carousel.css';
  import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css';
  
  export default {
    components: { VueSlickCarousel },
    props: {
      featuredMangas: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        settings: {
          dots: true,
          infinite: true,
          speed: 500,
          slidesToShow: 3,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 3000
        }
      };
    }
  };
  </script>
  
  <style scoped>
  .carousel img {
    width: 100%;
    height: auto;
    border-radius: 8px;
  }
  .carousel h3 {
    text-align: center;
    margin-top: 10px;
    font-size: 18px;
  }
  </style>