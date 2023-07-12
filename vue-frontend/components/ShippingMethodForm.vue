<template>
  <div>
    <div class="form-header">
      <h2> Shipping Method </h2>
      <div
        class="pencil-icon"
        v-on:click="onEdit"
      >
        <PencilIcon/>
      </div>
    </div>
    <div class="shipping-method-container" v-for="(meth, index) in this.shippingMethods" :key="index">
      <input type="radio" :id="'smethod-' + index" name="smethod" class="smethod" @change="onSelect($event)">
      <label for="smethod"> {{meth.carrier_title}} - {{meth.method_title}}: + {{meth.amount.value.toFixed(2)}} {{meth.amount.currency}} </label><br>
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
    shippingMethods: [],
    type: String,
  },
  methods: {
    onSelect($event) {
      this.$emit('send-form', $event);
    },
    onEdit() {
      this.$emit('edit-form', this.type);
    },
  }
}
</script>
