<template>
  <div class="order-summary">
    <h2>
      Cart
    </h2>
    <div class="order-summary-list" v-if="cartItems.length == 0">
      <EmptyCartIcon />
    </div>
    <ul
      class="order-summary-list"
      v-else
    >
      <li
        class="order-summary-list-list-item"
        v-for="prod in cartItems"
      >
        <img
          class="product-img"
          :src="prod.product.image.url"
        />
        <p class="order-summary-list-list-item-title">
          {{prod.product.name}} ({{prod.quantity}})
        </p>
        <p class="order-summary-list-list-item-price">
          {{prod.product.price_range.minimum_price.regular_price.value.toFixed(2)}}
          {{prod.product.price_range.minimum_price.regular_price.currency}}
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
    <div
      class="order-summary-list-list-item"
      v-if="shippingCosts != null"
    >
      <p class="order-summary-list-list-item-tag">
        Shipping Costs:
      </p>
      <p class="order-summary-list-list-item-title">
        {{shippingCosts.carrier_title}} - ({{shippingCosts.method_title}})
      </p>
      <p class="order-summary-list-list-item-price">
        {{shippingCosts.amount.value.toFixed(2)}}
        {{shippingCosts.amount.currency}}
      </p>
    </div>
    <div class="cart-footer">
      <span class="cart-footer-label"> Total: </span>
      <span class="cart-footer-amount"> {{cartTotal}} </span>
      <nuxt-link :to="`/checkout/cart`" v-if="cartActions">
        <p class="button">Continue to checkout</p>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import EmptyCartIcon from './EmptyCartIcon.vue';

export default {
  name: 'Cart',
  props: {
    cartItems: Array,
    cartTotal: String,
    cartActions: Boolean,
    shippingCosts: Object,
  },
  components: {
    EmptyCartIcon,
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
