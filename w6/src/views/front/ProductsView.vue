<template>
  <VueLoading v-model:active="isLoading"></VueLoading>
  <div class="container">
      這是產品列表頁面
    <table class="table">
      <thead>
        <tr>
          <th>圖片</th>
          <th>商品名稱</th>
          <th>價格</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td style="width: 200px">{{ product.title }}</td>
          <td>
            <div
              style="
                  height: 100px;
                  background-size: cover;
                  background-position: center;
                "
                :style="{ backgroundImage: `url(${product.imageUrl})` }">
            </div>
          </td>
          <td>
            <div class="h5" v-if="product.price === product.origin_price">{{ product.price }} 元</div>
              <div v-else>
                <del class="h6">原價 {{ product.origin_price }} 元</del>
              <div class="h5">現在只要 {{ product.price }} 元</div>
            </div>
          </td>
          <td>
            <div class="btn-group btn-group-sm">
              <button type="button" class="btn btn-outline-secondary"
                      @click="getProduct(product.id)">
                查看更多
              </button>
              <button type="button" class="btn btn-outline-danger"
                      @click="addToCart(product.id)"
                      :disabled="product.id === loadingItem"
                      >
                <i class="fas fa-spinner fa-pulse" v-if="loadingItem === product.id">
                </i>
                加到購物車
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 產品細節 -->
    <UserProductModal
      ref="UserProductModal"
      :id="productId"
      :add-to-cart="addToCart"
      >
    </UserProductModal>
  </div>
</template>

<script>
import UserProductModal from '@/components/UserProductModal.vue'

// 用解構方式，帶入環境變數
const { VITE_APP_URL, VITE_APP_PATH } = import.meta.env

export default {
  data () {
    return {
      products: [],
      product: {},
      productId: '', // 儲存開modal時的產品id
      loadingItem: '', // 存id，當此id存在就不能操作
      isLoading: false
    }
  },
  components: {
    UserProductModal
  },
  methods: {
    getProducts () {
      this.isLoading = true
      this.$http.get(`${VITE_APP_URL}api/${VITE_APP_PATH}/products/all`)
        .then((res) => {
          this.products = res.data.products
          this.isLoading = false
        })
        .catch((err) => {
          alert(err.message)
        })
    },
    addToCart (id) {
      const data = {
        product_id: id,
        qty: 1
      }
      this.loadingItem = id
      this.$http.post(`${VITE_APP_URL}api/${VITE_APP_PATH}/cart`, { data })
        .then((res) => {
          this.product = res.data.product
          this.$refs.UserProductModal.hideModal()
          this.loadingItem = ''
        })
        .catch((err) => {
          alert(err.message)
        })
    },
    getProduct (id) {
      this.productId = id
      // 取得產品id，抓資料
      this.$http.get(`${VITE_APP_URL}api/${VITE_APP_PATH}/product/${id}`)
        .then((res) => {
          this.tempProduct = res.data.product
          this.$refs.UserProductModal.openModal()
        })
        .catch((err) => {
          console.log(err.message)
        })
    }
  },
  mounted () {
    this.getProducts()
  }
}
</script>
