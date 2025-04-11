<template>
    <div class="admin-comments">
      <h1>Quản Lý Bình Luận</h1>
      <div class="nav-buttons">
        <button @click="$router.push('/admin')" class="back-btn">Quay lại</button>
        <button @click="fetchComments" class="refresh-btn">Tải lại</button>
      </div>
      <div v-if="isLoading" class="loading">Đang tải...</div>
      <div v-else>
        <table class="comment-table">
          <thead>
            <tr>
              <th>Người dùng</th>
              <th>Truyện</th>
              <th>Bình luận</th>
              <th>Ngày đăng</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="comment in comments" :key="comment.id">
              <td>{{ comment.user?.email || 'N/A' }}</td>
              <td>{{ comment.manga?.title || 'N/A' }}</td>
              <td>{{ comment.content }}</td>
              <td>{{ new Date(comment.createdAt).toLocaleString() }}</td>
              <td>
                <button @click="deleteComment(comment.id)" class="delete-btn">Xóa</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import api from '../api';
  import { useToast } from 'vue-toastification';
  
  export default {
    name: 'AdminCommentsPage',
    setup() {
      const toast = useToast();
      return { toast };
    },
    data() {
      return {
        comments: [],
        isLoading: false
      };
    },
    async created() {
      if (!this.isAdmin) {
        this.$router.push('/login');
        return;
      }
      await this.fetchComments();
    },
    computed: {
      isAdmin() {
        try {
          const token = localStorage.getItem('token');
          if (!token) return false;
          const decoded = JSON.parse(atob(token.split('.')[1]));
          return decoded.role === 'admin';
        } catch (err) {
          return false;
        }
      }
    },
    methods: {
      async fetchComments() {
        this.isLoading = true;
        try {
          const response = await api.get('/comments');
          this.comments = response.data;
        } catch (err) {
          this.toast.error('Lỗi khi lấy danh sách bình luận');
        } finally {
          this.isLoading = false;
        }
      },
      async deleteComment(commentId) {
        if (!confirm('Bạn chắc chắn muốn xóa bình luận này?')) return;
        try {
          await api.delete(`/comments/${commentId}`);
          this.comments = this.comments.filter(c => c.id !== commentId);
          this.toast.success('Xóa bình luận thành công');
        } catch (err) {
          this.toast.error('Lỗi khi xóa bình luận');
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .admin-comments {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  .nav-buttons {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }
  .back-btn, .refresh-btn {
    background-color: #3498db;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .comment-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  th {
    background-color: #e74c3c;
    color: white;
  }
  .delete-btn {
    background-color: #e74c3c;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .loading {
    text-align: center;
    padding: 20px;
  }
  </style>