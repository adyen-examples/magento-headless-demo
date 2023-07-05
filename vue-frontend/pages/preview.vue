<template>
  <main class="preview-page">
    <section class="cart">
      <div class="margin-container">
      </div>
      <StoreList
        v-bind:items="items"
        @add-item="addItemToCart"
      />
      <div class="summary-column">
        <Cart
          v-bind:cartItems="cartItems"
          v-bind:cartTotal="cartTotal"
          v-bind:cartActions="true"
          @add-item="addItemToCart"
          @remove-item="removeItemFromCart"
        />
      </div>
    </section>
  </main>
</template>

<script>
import Cart from '../components/Cart.vue';
import StoreList from '../components/StoreList.vue';
import * as graphql from '../plugins/graphql.js';

export default {
  asyncData({route}) {
    return {type: route.query.type};
  },
  head: {
    title: "Buy items",
  },
  components: {
    Cart,
    StoreList,
  },
  data() {
    return {
      cartId: '',
      items: [],
      cartItems: [],
      cartTotal: "0 EUR",
    }
  },

  async mounted() {
    await this.listStoreItems();
    await this.storage();
  },

  methods: {
    async storage() {

      let storedCart = localStorage.getItem('cart');
      if (storedCart) {
        this.cartId = storedCart;
      } else {
        await this.getCartId();
        localStorage.setItem('cart', this.cartId);
      }

      let storedCartItems = localStorage.getItem('cartItems');
      if (storedCartItems) {
        this.cartItems = JSON.parse(storedCartItems);
      }

      let storedCartTotal = localStorage.getItem('cartTotal');
      if (storedCartTotal) {
        this.cartTotal = JSON.parse(storedCartTotal);
      }
    },

    updateCart(responseObj){
      this.cartItems = responseObj.cart.items;
      this.cartTotal = responseObj.cart.prices.grand_total.value + " " + responseObj.cart.prices.grand_total.currency;

      localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
      localStorage.setItem('cartTotal', JSON.stringify(this.cartTotal));
    },

    async getCartId() {
      try {
        // Create cart data
        const data = JSON.stringify({
          query: `mutation{createEmptyCart}`,
        });

        const response = await graphql.sendGraphQLReq(data);

        this.cartId = response.data.createEmptyCart;
        return response;

      } catch (error) {
        console.error(error);
        alert("Error occurred. Look at console for details");
      }
    },

    async listStoreItems() {
      try {

        const data = JSON.stringify({
          query: `{products( search: "Messenger" filter: { price: { to: "50" } } pageSize: 25 sort: { price: DESC }) { items { name sku image { url label position disabled } price_range { minimum_price { regular_price { value currency } } }} total_count page_info { page_size }}}`,
        });

        const response = await graphql.sendGraphQLReq(data);
        this.items = response.data.products.items;

        return response;

      } catch (error) {
        console.error(error);
        alert("Error occurred. Look at console for details");
      }
    },

    async addItemToCart(item) {
      try {
        const cartId = this.cartId;
        const sku = item.sku;
        const quantity = 1;


        const response = await graphql.addProductsToCart(cartId, sku, quantity);
        this.updateCart(response);

        return response;

      } catch (error) {
        console.error(error);
        // alert("Error occurred. Look at console for details");
      }
    },

    async removeItemFromCart(item) {
      try {
        const cartId = this.cartId;
        const productId = item;

        const response = await graphql.removeItemFromCart(cartId, productId);
        this.updateCart(response);

        return response;

      } catch (error) {
        console.error(error);
        // alert("Error occurred. Look at console for details");
      }
    },

  },

};
</script>
