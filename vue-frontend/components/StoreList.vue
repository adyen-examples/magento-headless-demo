<template>
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
        <button v-on:click="addToCart(item)">
          Add to Cart
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StoreList',
  props: {
    items: Array,
  },
  methods: {
    addToCart(product){
      this.$emit('add-item', product);
    },
  }
}
</script>
