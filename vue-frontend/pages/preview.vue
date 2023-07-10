<template>
  <main class="preview-page">
    <section class="cart">
      <div class="margin-container">
      </div>
      <StoreList
        :items="storeItems"
        @add-item="addItem"
        v-if="!loading"
      />
      <div class="spinnerElement" v-else>
        <RefreshIcon/>
      </div>
      <div class="summary-column">
        <Cart
          :cartItems="cartItems"
          :cartTotal="cartTotal"
          :cartActions="true"
          :shippingCosts="null"
          @add-item="addItem"
          @remove-item="deleteItem"
        />
      </div>
    </section>
  </main>
</template>

<script>
import Cart from '../components/Cart.vue';
import StoreList from '../components/StoreList.vue';
import RefreshIcon from '../components/RefreshIcon.vue';
import * as graphql from '../plugins/graphql.js';

export default {
  head: {
    title: "Buy items",
  },
  components: {
    Cart,
    StoreList,
    RefreshIcon,
  },
  data() {
    return {
      cartId: '',
      storeItems: [],
      cartItems: [],
      cartTotal: "0.00 EUR",
      loading: true,
    }
  },

  async mounted() {
    await this.listStoreItems();
    await this.storage();
  },

  methods: {
    async storage() {
      let storedCart = localStorage.getItem('cart');
      if (storedCart != null) {
        this.cartId = storedCart;
        const response = await this.queryCart();
        this.updateCart(response);
      } else {
        await this.getCartId();
        localStorage.setItem('cart', this.cartId);
      }
      this.loading = false;
    },

    updateCart(responseObj){
      this.cartItems = responseObj.cart.items;
      this.cartTotal = responseObj.cart.prices.grand_total.value.toFixed(2) + " " + responseObj.cart.prices.grand_total.currency;
    },

    async getCartId() {
      try {
        const response = await graphql.getCartId();
        this.cartId = response;
        return response;

      } catch (error) {
        console.error(error);
      }
    },

    async listStoreItems() {
      try {
        const queryString = "Messenger";
        const response = await graphql.searchProducts(queryString);
        this.storeItems = response;

        return response;

      } catch (error) {
        console.error(error);
      }
    },

    async addItem(item) {
      try {
        const cartId = this.cartId;
        const sku = item.sku;
        const quantity = 1;

        const response = await graphql.addProductsToCart(cartId, sku, quantity);
        this.updateCart(response);
        return response;

      } catch (error) {
        console.error(error);
      }
    },

    async deleteItem(item) {
      try {
        const cartId = this.cartId;
        const productId = item;

        const response = await graphql.removeItemFromCart(cartId, productId);
        this.updateCart(response);
        return response;

      } catch (error) {
        console.error(error);
      }
    },

    // Query current cart. Might use this instead of localStorage to retrieve active cart contents
    async queryCart() {
      try {
        const cartId = this.cartId;
        const response = await graphql.queryCart(cartId);
        return response.data;

      } catch (error) {
        console.error(error);
      }
    },
  },

};
</script>
