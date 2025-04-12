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
            <tr v-for="comment in comments" :key="comment._id">
              <td>{{ comment.user.email }}</td>
              <td>{{ comment.manga.title }}</td>
              <td>{{ comment.content }}</td>
              <td>{{ new Date(comment.createdAt).toLocaleString() }}</td>
              <td>
                <button @click="deleteComment(comment._id)" class="delete-btn">Xóa</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import api from '../api';
  
  export default {
    data() {
      return {
        comments: [],
        isLoading: false
      };
    },
    async created() {
      await this.fetchComments();
    },
    methods: {
      async fetchComments() {
        this.isLoading = true;
        try {
          const response = await api.getComments();
          this.comments = response.data;
        } catch (err) {
          console.error('Lỗi khi lấy danh sách bình luận', err);
        } finally {
          this.isLoading = false;
        }
      },
      async deleteComment(id) {
        if (confirm('Bạn chắc chắn muốn xóa bình luận này?')) {
          try {
            await api.deleteComment(id);
            this.comments = this.comments.filter(c => c._id !== id);
          } catch (err) {
            console.error('Lỗi khi xóa bình luận', err);
          }
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
    padding: 8px 16px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .comment-table {
    width: 100%;
    border-collapse: collapse;
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
    padding: 8px 16px;
    background-color: #e74c3c;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .loading {
    text-align: center;
    padding: 20px;
  }
  </style>