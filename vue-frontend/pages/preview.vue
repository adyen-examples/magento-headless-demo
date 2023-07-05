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
    title: "Cart preview",
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
        // this.logStatus();

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
        const products = '{ quantity:' + quantity + ' sku:' + '"' + sku + '"' + '}';

        // Add items to cart
        const data = JSON.stringify({
          query: `mutation{ addProductsToCart( cartId: `
            + '"' + cartId + '"'
            + ` cartItems: [` + products
            + `] ) {  cart {  items { id product { name  sku image { url label position disabled } price_range { minimum_price { regular_price { value currency } } } } quantity } prices { grand_total { value currency } }  } } }`,
        });

        const response = await graphql.sendGraphQLReq(data);
        this.cartItems = response.data.addProductsToCart.cart.items;
        this.cartTotal = response.data.addProductsToCart.cart.prices.grand_total.value + " " + response.data.addProductsToCart.cart.prices.grand_total.currency;
        localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
        localStorage.setItem('cartTotal', JSON.stringify(this.cartTotal));

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

        // Add items to cart
        const data = JSON.stringify({
          query: `mutation{ removeItemFromCart( input: { cart_id: `
            + '"' + cartId + '"'
            + `, cart_item_id: `
            + '"' + productId + '"'
            + ` }) {  cart {  items { id product { name  sku image { url label position disabled } price_range { minimum_price { regular_price { value currency } } } } quantity } prices { grand_total { value currency } }  } } }`,
        });

        const response = await graphql.sendGraphQLReq(data);
        this.cartItems = response.data.removeItemFromCart.cart.items;
        localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
        return response;

      } catch (error) {
        console.error(error);
        // alert("Error occurred. Look at console for details");
      }
    },

  },
};
</script>
