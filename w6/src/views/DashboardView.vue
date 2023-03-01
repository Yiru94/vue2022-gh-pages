<template>
  <div class="container">
    這是後台頁面
    <router-link to="/admin/products">產品列表</router-link> |
    <router-link to="/admin/orders">訂單列表</router-link> |
    <router-link to="/">回前台首頁</router-link> |
    <a href="#" @click.prevent="logout">登出</a>
  </div>
  <hr>
  <RouterView v-if="checkSuccess"></RouterView>
</template>

<script>
import { RouterView } from 'vue-router'
const { VITE_APP_URL } = import.meta.env

export default {
  data () {
    return {
      checkSuccess: false
    }
  },
  comments: {
    RouterView
  },
  methods: {
    checkLogin () {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)yiruToken\s*=\s*([^;]*).*$)|^.*$/, '$1')
      this.$http.defaults.headers.common.Authorization = token
      this.$http.post(`${VITE_APP_URL}api/user/check`)
        .then(() => {
          this.checkSuccess = true
        })
        .catch((err) => {
          alert(err.response.data.message)
          this.$router.push('/login')
        })
    },
    logout () {
      document.cookie = 'yiruToken=; expires=;'
      this.$router.push('/login')
    }
  },
  mounted () {
    this.checkLogin()
  }
}
</script>

<style lang="scss">

</style>
