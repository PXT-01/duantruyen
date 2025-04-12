<template>
  <div id="app">
    <Header @search="handleSearch" />
    <div class="main-content">
      <Sidebar />
      <router-view :key="$route.fullPath" />
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';
import Footer from './components/Footer.vue';

export default {
  components: {
    Header,
    Sidebar,
    Footer
  },
  methods: {
    handleSearch(mangas) {
      // Xử lý kết quả tìm kiếm nếu cần
    }
  }
};
</script>

<style>
body {
  margin: 0;
  font-family: 'Roboto', sans-serif;
  background-color: #f8f9fa;
}
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.main-content {
  display: flex;
  flex: 1;
}
</style>