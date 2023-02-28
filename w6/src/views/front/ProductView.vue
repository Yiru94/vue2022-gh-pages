<template>
  這是單一產品頁面
  <h2>{{ product.title }}</h2>
  <img :src="product.imageUrl" class="img-fluild" alt="">
</template>

<script>
const { VITE_APP_URL, VITE_APP_PATH } = import.meta.env

export default {
  data () {
    return {
      product: {}
    }
  },
  methods: {
    getProduct () {
      // 到$route取出id
      const { id } = this.$route.params
      this.$http.get(`${VITE_APP_URL}api/${VITE_APP_PATH}/product/${id}`)
        .then((res) => {
          console.log(res.data.product)
          this.product = res.data.product
        })
        .catch((err) => {
          alert(err.message)
        })
    }
  },
  mounted () {
    this.getProduct()
  }
}
</script>
