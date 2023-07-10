<template>
  <div class="bottom-container">
    <h2> Payment </h2>
    <div class="payment-container">
      <div
        class="container-wrapper"
        v-for="(pm, index) in this.paymentMethods"
        :key="index"
      >
        <div
          class="pm-header"
          v-if="pm.type!='scheme' && pm.icon"
        >
          <input
            type="radio"
            class="pm-radio"
            :id="`radio-${index}`"
            name="radiopm"
            :value="pm.type"
            @change="changeSelectedPaymentMethod(pm.type)"
          >
          <img
            v-if="pm.icon"
            :src="pm.icon.url"
            :style="{ height: pm.icon.height, width: pm.icon.width + 'px' }"
          >
          <label
            v-if="paymentMethodsResponse.paymentMethods[index]"
            class="pm-label"
            for="radiopm"
          >
            {{ pm.type == 'klarna' || pm.type == 'klarna_account' || pm.type == 'klarna_paynow'  ? " " : "Pay with" }}  {{paymentMethodsResponse.paymentMethods.filter(m => m.type == pm.type ).length > 0 ? paymentMethodsResponse.paymentMethods.filter(m => m.type == pm.type )[0].name : pm.type}}
          </label>
        </div>
        <div
          class="component"
          :id="`${pm.type}-container`"
          v-show="selectedpm === `${pm.type}`"
        > </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaymentArea',
  props: {
    paymentMethods: Array,
    paymentMethodsResponse: Object,
    selectedpm: String,
  },
  methods: {
    changeSelectedPaymentMethod(event){
      this.$emit('change-pm', event);
    },
  }
}
</script>
