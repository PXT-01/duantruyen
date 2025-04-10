<template>
    <div class="auth-page">
      <div class="auth-container">
        <h2>Đăng Nhập</h2>
        <form @submit.prevent="login">
          <div class="form-group">
            <label>Email:</label>
            <input 
              v-model="email" 
              type="email" 
              placeholder="Nhập email" 
              required 
            />
          </div>
          <div class="form-group">
            <label>Mật khẩu:</label>
            <input 
              v-model="password" 
              type="password" 
              placeholder="Nhập mật khẩu" 
              required 
            />
          </div>
          <button type="submit" class="auth-btn">Đăng Nhập</button>
        </form>
        <p v-if="error" class="error">{{ error }}</p>
        <p>
          Chưa có tài khoản? 
          <router-link to="/register" class="link">Đăng ký ngay</router-link>
        </p>
        <p v-if="error" class="error">{{ error }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import api from '../api';
  
  export default {
    name: 'LoginPage',
    data() {
      return {
        email: '',
        password: '',
        error: ''
      }
    },
    methods: {
      async login() {
        try {
          const response = await api.post('/auth/login', {
            email: this.email,
            password: this.password
          });
          localStorage.setItem('token', response.data.token);
          this.$router.push('/');
        } catch (err) {
          this.error = err.response?.data?.message || 'Đăng nhập thất bại';
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .auth-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f4f4f4;
  }
  .auth-container {
    background-color: white;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    width: 100%;
    max-width: 400px;
  }
  .auth-container h2 {
    text-align: center;
    color: #e74c3c;
    margin-bottom: 20px;
  }
  .form-group {
    margin-bottom: 15px;
  }
  .form-group label {
    display: block;
    margin-bottom: 5px;
    color: #333;
  }
  .form-group input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  .auth-btn {
    width: 100%;
    padding: 10px;
    background-color: #e74c3c;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }
  .auth-btn:hover {
    background-color: #c0392b;
  }
  p {
    text-align: center;
    margin-top: 15px;
  }
  .link {
    color: #3498db;
    text-decoration: none;
  }
  .link:hover {
    text-decoration: underline;
    .error {
  color: #e74c3c;
  text-align: center;
  margin-top: 10px;
}
  }
  </style>