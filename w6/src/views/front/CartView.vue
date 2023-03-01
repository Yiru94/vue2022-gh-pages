<template>
  <div class="container">
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
  </div>
  <div class="my-5 row justify-content-center">
    <VeeForm ref="form" class="col-md-6" v-slot="{ errors }" @submit="sendOrder">
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <VeeField id="email" name="email" type="email" class="form-control"
                :class="{ 'is-invalid': errors['email'] }" placeholder="請輸入 Email" rules="email|required"
                v-model="form.user.email"></VeeField>
        <ErrorMessage name="email" class="invalid-feedback"></ErrorMessage>
      </div>

      <div class="mb-3">
        <label for="name" class="form-label">收件人姓名</label>
        <VeeField id="name" name="姓名" type="text" class="form-control" :class="{ 'is-invalid': errors['姓名'] }"
                  placeholder="請輸入姓名" rules="required" v-model="form.user.name"></VeeField>
        <ErrorMessage name="姓名" class="invalid-feedback"></ErrorMessage>
      </div>

      <div class="mb-3">
        <label for="tel" class="form-label">收件人電話</label>
        <VeeField id="tel" name="電話" type="text" class="form-control" :class="{ 'is-invalid': errors['電話'] }"
                  placeholder="請輸入電話" :rules="isPhone" v-model="form.user.tel"></VeeField>
        <ErrorMessage name="電話" class="invalid-feedback"></ErrorMessage>
      </div>

      <div class="mb-3">
        <label for="address" class="form-label">收件人地址</label>
        <VeeField id="address" name="地址" type="text" class="form-control" :class="{ 'is-invalid': errors['地址'] }"
                placeholder="請輸入地址" rules="required" v-model="form.user.address"></VeeField>
        <ErrorMessage name="地址" class="invalid-feedback" v-model="form.message"></ErrorMessage>
      </div>

      <div class="mb-3">
        <label for="message" class="form-label">留言</label>
        <textarea id="message" class="form-control" cols="30" rows="10" ></textarea>
      </div>
      <div class="text-end">
        <button type="submit" class="btn btn-danger"
                >送出訂單</button>
      </div>
    </VeeForm>
  </div>
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
