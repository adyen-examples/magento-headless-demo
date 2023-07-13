<template>
  <main class="preview-page">
    <section class="cart" v-if="!loading">
      <div class="margin-container">
      </div>
      <StoreList
        :storeItems="storeItems"
        @add-item="addItem"
      />
      <div class="summary-column">
        <Cart
          :cartItems="cartItems"
          :cartTotal="cartTotal"
          :cartActions="cartItems.length > 0"
          :shippingCosts="null"
          @add-item="addItem"
          @remove-item="deleteItem"
        />
      </div>
    </section>
    <div class="spinnerElement" v-else>
      <RefreshIcon/>
    </div>
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

      // Set localstorage item to local cartId (if exists), or get new cartId and save to localStorage
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

    // Update cartItems and cartTotal based on a response object
    updateCart(responseObj) {
      this.cartItems = responseObj.cart.items;
      this.cartTotal = responseObj.cart.prices.grand_total.value.toFixed(2) + " " + responseObj.cart.prices.grand_total.currency;
    },

    // Query for a new guest cartId and set to data var
    async getCartId() {
      try {
        const response = await graphql.getCartId();
        this.cartId = response;
        return response;

      } catch (error) {
        console.error(error);
      }
    },

    // Query search for items in Magento inventory. Search so far restricted to bags to avoid sizes and color selections mandatory for some items
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

    // Query to add item to current cart and update cart info
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

    // Query to delete all instances of an item from current cart and update cart info
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

    // Query current cart info
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
