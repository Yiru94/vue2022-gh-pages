<template>
  這是購物車頁面
  <table class="table align-middle">
    <thead>
      <tr>
        <th></th>
        <th>品名</th>
        <th style="width: 150px">數量/單位</th>
        <th>單價</th>
      </tr>
    </thead>
    <tbody>
      <template v-if="cart.carts">
        <tr v-for="item in cart.carts" :key="item.id">
          <td>
            <button
              type="button"
              class="btn btn-outline-danger btn-sm"
              @click="deleteItem(item)"
              :disabled="item.id === loadingItem"
            >
              <i
                class="fas fa-spinner fa-pulse"
                v-if="loadingItem === item.id"
              ></i>
              x
            </button>
          </td>
          <td>
            {{ item.product.title }}
            <div class="text-success" v-if="item.coupon">已套用優惠券</div>
          </td>
          <td>
            <div class="input-group input-group-sm">
              <div class="input-group mb-3">
                <select
                  name=""
                  id=""
                  class="form-select"
                  v-model="item.qty"
                  @change="updateCartItem(item)"
                  :disabled="item.id === loadingItem"
                >
                  <option :value="i" v-for="i in 20" :key="`${i}12456`">
                    {{ i }}
                  </option>
                </select>
                <span class="input-group-text" id="basic-addon2">{{
                  item.product.unit
                }}</span>
              </div>
            </div>
          </td>
          <td class="text-end">
            <small class="text-success" v-if="cart.final_total !== cart.total"
              >折扣價：</small
            >
            {{ item.final_total }}
          </td>
        </tr>
      </template>
    </tbody>
    <tfoot>
      <tr>
        <td colspan="3" class="text-end">總計</td>
        <td class="text-end">{{ cart.total }}</td>
      </tr>
      <tr>
        <td colspan="3" class="text-end text-success">折扣價</td>
        <td class="text-end text-success">{{ cart.final_total }}</td>
      </tr>
    </tfoot>
  </table>
</template>

<script>
const { VITE_APP_URL, VITE_APP_PATH } = import.meta.env

export default {
  data () {
    return {
      products: [],
      productId: '',
      cart: {},
      loadingItem: '', // 存id，當此id存在就不能操作
      isLoading: false,
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: ''
        },
        message: ''
      }
    }
  },
  methods: {
    getCarts () {
      this.$http.get(`${VITE_APP_URL}api/${VITE_APP_PATH}/cart`)
        .then((res) => {
          this.cart = res.data.data
        })
        .catch((err) => {
          alert(err.data.message)
        })
    },
    updateCartItem (item) {
      const data = {
        product_id: item.product.id,
        qty: item.qty
      }
      this.loadingItem = item.id// 參照html的disabled功能
      this.$http.put(`${VITE_APP_URL}api/${VITE_APP_PATH}/cart/${item.id}`, { data })
        .then((res) => {
          this.getCarts()
          this.loadingItem = ''
        })
        .catch((err) => {
          alert(err.data.message)
        })
    },
    deleteItem (item) {
      this.loadingItem = item.id
      this.$http.delete(`${VITE_APP_URL}api/${VITE_APP_PATH}/cart/${item.id}`)
        .then((res) => {
          this.getCarts()
          this.loadingItem = ''
        })
        .catch((err) => {
          alert(err.data.message)
        })
    },
    deleteCarts () {
      this.$http.delete(`${VITE_APP_URL}api/${VITE_APP_PATH}/carts`)
        .then((res) => {
          this.getCarts()
        })
        .catch((err) => {
          alert(err.data.message)
        })
    },
    // 電話驗證
    isPhone (value) {
      if (!value) {
        return '電話 為必填'
      };
      const phoneNumber = /^(09)[0-9]{8}$/
      return phoneNumber.test(value) ? true : '需要正確的電話號碼'
    },
    // 送訂單
    sendOrder () {
      const order = this.form
      this.$http.post(`${VITE_APP_URL}api/${VITE_APP_PATH}/order`, { data: order })
        .then((res) => {
          alert(res.data.message)
          this.$refs.form.resetForm()// 淨空表單
          this.form.message = ''
          this.getCarts()
        })
        .catch((err) => {
          alert(err.data.message)
        })
    }
  },
  mounted () {
    this.getCarts()
  }
}
</script>
