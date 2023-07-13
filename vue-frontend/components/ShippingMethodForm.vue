<template>
  <div>
    <div class="form-header">
      <h2> Shipping Method </h2>
      <div
        class="pencil-icon"
        v-if="isShippingMethodSet"
        v-on:click="onEdit"
      >
        <PencilIcon/>
      </div>
    </div>
    <div
      class="shipping-method-container"
      v-for="(method, index) in this.shippingMethods"
      :key="index"
    >
      <input type="radio" :id="'smethod-' + index" name="shippingMethod" @change="onSelect($event)">
      <label for="shippingMethod"> {{method.carrier_title}} - {{method.method_title}}: + {{method.amount.value.toFixed(2)}} {{method.amount.currency}} </label><br>
    </div>
  </div>
</template>

<script>
import PencilIcon from './PencilIcon.vue';

export default {
  name: 'ShippingMethodForm',
  components: {
    PencilIcon,
  },
  props: {
    shippingMethods: Array,
    type: String,
    isShippingMethodSet: Boolean,
  },
  methods: {

    // Emit event to parent when input element changes
    onSelect($event) {
      this.$emit('send-form', $event);
    },

    // Emit event to parent when the pencilIcon is clicked (clear form)
    onEdit() {
      this.$emit('edit-form', this.type);
    },
  }
}
</script>
