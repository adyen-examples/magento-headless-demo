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
import * as rest from '../plugins/rest.js';
import { ref, onMounted } from 'vue';

export default {
  head: {
    title: "Buy items",
  },
  components: {
    Cart,
    StoreList,
    RefreshIcon,
  },
  setup() {
    const cartId = ref('');
    const storeItems = ref([]);
    const cartItems = ref([]);
    const cartTotal = ref('0.00 EUR');
    const loading = ref(true);

    // When mounted, retrieve localStorage and query magento store items
    onMounted(async function () {
      await listStoreItems();
      await storage();
    });

    // Retrieves the relevant localStorage data and updated cart with response
    const storage = async function() {
      // Set localstorage item to local cartId (if exists), or get new cartId and save to localStorage
      if (localStorage.getItem('orderNumber') != null) {
        localStorage.removeItem('orderNumber');
      }

      let storedCart = localStorage.getItem('cart');
      if (storedCart != null) {
        cartId.value = storedCart;
        const response = await queryCart();
        updateCart(response);

      } else {
        await getCartId();
        localStorage.setItem('cart', cartId.value);
      }
      loading.value = false;
    };

    // Update cartItems and cartTotal based on a response object
    const updateCart = function(responseObj) {
      cartItems.value = responseObj.cart.items;
      cartTotal.value = responseObj.cart.prices.grand_total.value.toFixed(2) + " " + responseObj.cart.prices.grand_total.currency;
    };

    // Query for a new guest cartId and set to data var
    const getCartId = async function() {
      try {
        const response = await graphql.getCartId();
        cartId.value = response;
        return response;

      } catch (error) {
        console.error(error);
      }
    };

    // Query search for items in Magento inventory. Search so far restricted to bags to avoid sizes and color selections mandatory for some items
    const listStoreItems = async function() {
      try {
        const queryString = "Messenger";
        const response = await graphql.searchProducts(queryString);
        storeItems.value = response;
        return response;
      } catch (error) {
        console.error(error);
      }
    };

    // Query to add item to current cart and update cart info
    const addItem = async function(item) {
      try {
        const cart = cartId.value;
        const sku = item.sku;
        const quantity = 1;

        const response = await graphql.addProductsToCart(cart, sku, quantity);
        updateCart(response);
        return response;
      } catch (error) {
        console.error(error);
      }
    };

    // Query to delete all instances of an item from current cart and update cart info
    const deleteItem = async function(item) {
      try {
        const cart = cartId.value;
        const productId = item;

        const response = await graphql.removeItemFromCart(cart, productId);
        updateCart(response);
        return response;
      } catch (error) {
        console.error(error);
      }
    };

    // Query current cart info
    const queryCart = async function() {
      try {
        const cart = cartId.value;
        const response = await graphql.queryCart(cart);
        return response.data;
      } catch (error) {
        console.error(error);
      }
    };

    return {
      cartId,
      storeItems,
      cartItems,
      cartTotal,
      loading,
      storage,
      updateCart,
      getCartId,
      listStoreItems,
      addItem,
      deleteItem,
      queryCart,
    }
  }
}
</script>
