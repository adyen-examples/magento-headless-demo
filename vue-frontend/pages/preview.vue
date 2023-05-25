<template>
  <main class="preview-page">
    <section class="cart">

      <div class="store-container">
        <div
          class="item-container"
          v-for="item in this.items"
        >
          <img
            class="product-img"
            :src="item.image.url"
          >
          <div class="statitle">
            {{item.name}}
          </div>
          <div class="statval">
            {{item.price_range.minimum_price.regular_price.value}}
            {{item.price_range.minimum_price.regular_price.currency}}
            <button v-on:click="addItemToCart(item)">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <div class="summary-column">
        <div class="order-summary">
          <h2>
            My Cart
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
                v-on:click=""
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
      url: "https://8080-adyenexampl-adyenmagent-7j25ev8o4sr.ws-eu97.gitpod.io",
      bearer: "mbvjlftxgpunwaiqi0tfsn2dhkhxpips",
      cartId: '',
      items: [],
      cartItems: [],
      cartTotal: "0EUR",
    }
  },

  async mounted() {
    this.storage();

    await this.getCartId();
    await this.listStoreItems();

    localStorage.setItem('cart', this.cartId);

  },

  methods: {
    storage() {
      localStorage.setItem('url', 'https://8080-adyenexampl-adyenmagent-7j25ev8o4sr.ws-eu97.gitpod.io');
      localStorage.setItem('bearer', "mbvjlftxgpunwaiqi0tfsn2dhkhxpips");
    },

    hideSummary() {
      if (document.getElementsByClassName("hidden").length) {
        document.getElementsByClassName("summary-column")[0].classList.remove("hidden");;
      }
      else {
        document.getElementsByClassName("summary-column")[0].classList.add("hidden");;
      }
    },

    async getCartId() {
      try {
        const host = this.url;
        const bearer = this.bearer;

        // Create cart data
        const data = JSON.stringify({
          query: `mutation{createEmptyCart}`,
        });

        const response = await this.sendGraphQLReq(host, bearer, data);

        this.cartId = response.data.createEmptyCart;
        return response;

      } catch (error) {
        console.error(error);
        alert("Error occurred. Look at console for details");
      }
    },


    async listStoreItems() {
      try{
        const host = this.url;
        const bearer = this.bearer;


        const data = JSON.stringify({
          query:  `{products( search: "Messenger" filter: { price: { to: "50" } } pageSize: 25 sort: { price: DESC }) { items { name sku image { url label position disabled } price_range { minimum_price { regular_price { value currency } } }} total_count page_info { page_size }}}`,
        });

        const response = await this.sendGraphQLReq(host, bearer, data);
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

        const host = this.url;
        const bearer = this.bearer;
        const cartId = this.cartId;
        const sku = item.sku;
        const quantity = 1;
        const products = '{ quantity:' + quantity + ' sku:' + '"' + sku + '"' +'}';

        // Add items to cart
        const data = JSON.stringify({
          query: `mutation{ addProductsToCart( cartId: `
            + '"' + cartId + '"'
            + ` cartItems: [` + products
            + `] ) {  cart {  items { product { name  sku image { url label position disabled } price_range { minimum_price { regular_price { value currency } } } } quantity } prices { grand_total { value currency } }  } } }`,
        });

        const response = await this.sendGraphQLReq(host, bearer, data);
        this.cartItems = response.data.addProductsToCart.cart.items;
        this.cartTotal = response.data.addProductsToCart.cart.prices.grand_total.value + response.data.addProductsToCart.cart.prices.grand_total.currency;
        console.log(response.data.addProductsToCart.cart.prices.grand_total.value + response.data.addProductsToCart.cart.prices.grand_total.currency);

        return response;

      } catch (error) {
        console.error(error);
        // alert("Error occurred. Look at console for details");
      }
    },

    async removeItemFromCart(item) {
      try {
        const host = this.url;
        const bearer = this.bearer;
        const cartId = this.cartId;
        const sku = item.sku;
        const quantity = 1;
        const products = '{ quantity:' + quantity + ' sku:' + '"' + sku + '"' +'}';

        // Add items to cart
        const data = JSON.stringify({
          query: `mutation{ addProductsToCart( cartId: ` + cartId + ` cartItems: [` + products + `] ) {  cart {  items { product { name  sku } quantity }  } } }`,
        });

        const response = await this.sendGraphQLReq(host, bearer, data);
        this.cartItems = response.data.addProductsToCart.cart.items;
        return response;

      } catch (error) {
        console.error(error);
        // alert("Error occurred. Look at console for details");
      }
    },

    async sendGraphQLReq(host, bearer, data) {
      try {
        var response;
        response = await fetch(host +'/graphql', {
          method: 'POST',
          mode: 'cors',
          headers: {
            "Content-Type": "application/json",
            'Content-Length': data.length,
            Authorization: 'Bearer '+ bearer,
            'Origin': 'https://8080-adyenexampl-adyenvueonl-wumtblawveo.ws-eu96.gitpod.io',
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
