<template>
  <div class="container">
    <h3>這是前台頁面</h3><br>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/products">產品列表</router-link> |
    <router-link to="/cart">購物車</router-link> |
    <router-link to="/login">後台登入</router-link> |
    <router-link to="/admin/products">後台產品</router-link>
  </div>
  <hr>
  <RouterView></RouterView>
</template>

<script>
import { RouterView } from 'vue-router'

export default {
  components: {
    RouterView
  }
}
</script>
