<template>
  <div class="order-summary">
    <h2>
      Cart
    </h2>
    <ul class="order-summary-list">
      <li
        class="order-summary-list-list-item"
        v-if="cartItems.length"
        v-for="prod in cartItems"
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
          v-on:click="addToCart(prod.product)"
          v-if="cartActions"
        >
          +
        </button>
        <button
          class="order-summary-list-list-item-button"
          v-on:click="removeFromCart(prod.id)"
          v-if="cartActions"
        >
          -
        </button>
      </li>
    </ul>
    <div class="cart-footer">
      <span class="cart-footer-label"> Total: </span>
      <span class="cart-footer-amount"> {{cartTotal}} </span>
      <nuxt-link :to="`/checkout/${type}`" v-if="cartActions">
        <p class="button">Continue to checkout</p>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  asyncData({ route }) {
    return { type: route.query.type };
  },
  name: 'Cart',
  props: {
    cartItems: Array,
    cartTotal: String,
    cartActions: Boolean,
  },
  methods: {
    addToCart(product){
      this.$emit('add-item', product);
    },
    removeFromCart(product){
      this.$emit('remove-item', product);
    },

  }
}
</script>
