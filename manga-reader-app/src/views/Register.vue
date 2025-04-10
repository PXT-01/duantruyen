<template>
    <div class="auth-page">
      <div class="auth-container">
        <h2>Đăng Ký</h2>
        <form @submit.prevent="register">
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
          <div class="form-group">
            <label>Xác nhận mật khẩu:</label>
            <input 
              v-model="confirmPassword" 
              type="password" 
              placeholder="Xác nhận mật khẩu" 
              required 
            />
          </div>
          <button type="submit" class="auth-btn">Đăng Ký</button>
        </form>
        <p v-if="error" class="error">{{ error }}</p>
        <p>
          Đã có tài khoản? 
          <router-link to="/login" class="link">Đăng nhập ngay</router-link>
        </p>
      </div>
    </div>
  </template>
  
  <script>
import api from '../api';

export default {
  name: 'RegisterPage',
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      error: ''
    }
  },
  methods: {
    async register() {
      if (this.password !== this.confirmPassword) {
        this.error = 'Mật khẩu xác nhận không khớp!';
        return;
      }
      try {
        await api.post('/auth/register', {
          email: this.email,
          password: this.password
        });
        this.$router.push('/login');
      } catch (err) {
        this.error = err.response?.data?.message || 'Đăng ký thất bại';
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
  }
  </style>