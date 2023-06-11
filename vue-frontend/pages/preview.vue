<template>
  <main class="preview-page">
    <section class="cart">
      <div class="margin-container">
      </div>
      <div class="store-container">
        <div
          class="item-container"
          v-for="item in this.items"
        >
          <img
            class="store-product-img"
            :src="item.image.url"
          >
          <div class="statitle">
            {{item.name}}
          </div>
          <div class="statval">
            {{item.price_range.minimum_price.regular_price.value}}
            {{item.price_range.minimum_price.regular_price.currency}}
            <br>
            <button v-on:click="addItemToCart(item)">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <div class="summary-column">
        <div class="order-summary">
          <h2>
            Cart
          </h2>
          <ul class="order-summary-list">
            <li
              class="order-summary-list-list-item"
              v-if="cartItems.length"
              v-for="prod in this.cartItems"
            >
              <img
                class="product-img"
                :src="prod.product.image.url"
              />
              <p class="order-summary-list-list-item-title">
                {{prod.product.name}}
              </p>
              <p class="order-summary-list-list-item-price">
                {{prod.product.price_range.minimum_price.regular_price.value}}
                {{prod.product.price_range.minimum_price.regular_price.currency}}
                ({{prod.quantity}})
              </p>
              <button
                class="order-summary-list-list-item-button"
                v-on:click="addItemToCart(prod.product)"
              >
                +
              </button>
              <button
                class="order-summary-list-list-item-button"
                v-on:click="removeItemFromCart(prod.id)"
              >
                -
              </button>
            </li>
          </ul>
        </div>

        <div class="cart-footer">
          <span class="cart-footer-label"> Total: </span>
          <span class="cart-footer-amount"> {{cartTotal}} </span>
          <nuxt-link :to="`/checkout/${type}`">
            <p class="button">Continue to checkout</p>
          </nuxt-link>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  asyncData({ route }) {
    return { type: route.query.type };
  },
  head: {
    title: "Cart preview",
  },
  data() {
    return {
      url: "$BaseURL",
      bearer: "$MagentoToken",
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
      localStorage.setItem('url', this.url);
      localStorage.setItem('bearer', this.bearer);

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

        const response = await this.sendGraphQLReq(data);

        this.cartId = response.data.createEmptyCart;
        return response;

      } catch (error) {
        console.error(error);
        alert("Error occurred. Look at console for details");
      }
    },

    async listStoreItems() {
      try{

        const data = JSON.stringify({
          query:  `{products( search: "Messenger" filter: { price: { to: "50" } } pageSize: 25 sort: { price: DESC }) { items { name sku image { url label position disabled } price_range { minimum_price { regular_price { value currency } } }} total_count page_info { page_size }}}`,
        });

        const response = await this.sendGraphQLReq(data);
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
        const products = '{ quantity:' + quantity + ' sku:' + '"' + sku + '"' +'}';

        // Add items to cart
        const data = JSON.stringify({
          query: `mutation{ addProductsToCart( cartId: `
            + '"' + cartId + '"'
            + ` cartItems: [` + products
            + `] ) {  cart {  items { id product { name  sku image { url label position disabled } price_range { minimum_price { regular_price { value currency } } } } quantity } prices { grand_total { value currency } }  } } }`,
        });

        const response = await this.sendGraphQLReq(data);
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

        const response = await this.sendGraphQLReq(data);
        this.cartItems = response.data.removeItemFromCart.cart.items;
        localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
        return response;

      } catch (error) {
        console.error(error);
        // alert("Error occurred. Look at console for details");
      }
    },

    async sendGraphQLReq(data) {
      try {
        const host = this.url;
        const bearer = this.bearer;
        var response;
        response = await fetch(host +'/graphql', {
          method: 'POST',
          mode: 'cors',
          headers: {
            "Content-Type": "application/json",
            'Content-Length': data.length,
            Authorization: 'Bearer '+ bearer,
            'Origin': '$BaseURL',
          },
          body: data,
        })
          .then((res) => res.json())
          //.then((result) => console.log( result))
          .then(result => response = result)
        return response;

      } catch (error) {
        console.error(error);
        alert("Error occurred. Look at console for details");
      }
    },

  },
};
</script>
