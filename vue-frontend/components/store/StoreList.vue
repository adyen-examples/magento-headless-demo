<template>
  <div class="store-container">
    <div
      class="item-container"
      v-for="item in this.storeItems"
      :key="item.id"
    >
      <img
        class="store-product-img"
        :src="item.image.url"
      >
      <div class="statitle">
        {{item.name}}
      </div>
      <div class="statval">
        {{item.price_range.minimum_price.regular_price.value.toFixed(2)}}
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
    storeItems: Array,
  },
  methods: {

    // Emit event to parent component with the selected product when Add to Cart button is clicked
    addToCart(product){
      this.$emit('add-item', product);
    },
  }
}
</script>
