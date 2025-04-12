<template>
    <div class="sidebar">
      <h2>Thể loại</h2>
      <ul>
        <li><router-link to="/genre/action">Hành động</router-link></li>
        <li><router-link to="/genre/comedy">Hài hước</router-link></li>
        <li><router-link to="/genre/romance">Lãng mạn</router-link></li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Sidebar'
  };
  </script>
  
  <style scoped>
  .sidebar {
    width: 200px;
    padding: 20px;
    background-color: #f8f9fa;
    border-right: 1px solid #ddd;
  }
  h2 {
    margin-bottom: 20px;
  }
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    margin-bottom: 10px;
  }
  a {
    text-decoration: none;
    color: #3498db;
  }
  a:hover {
    text-decoration: underline;
  }
  </style>