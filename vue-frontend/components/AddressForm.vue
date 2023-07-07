<template>
  <form v-if="isAddressSet">
    <label for="street">Street:</label>
    <label for="postcode">Postcode</label><br>
    <input type="text" id="street" name="street">
    <input type="text" id="postcode" name="postcode"><br>
    <label for="city">City:</label>
    <label for="region">Region</label><br>
    <input type="text" id="city" name="city">
    <input type="text" id="region" name="region"><br>
    <label for="country">Country</label>
    <label v-if="canSameBilling" for="samebilling" id="checkbox-label">Same as Billing</label>
    <input v-if="canSameBilling" type="checkbox" id="samebilling" name="samebilling"><br>
    <input type="text" id="country" name="country"><br>
    <button type='button' @click="sendAddressForm()">Submit</button>
  </form>
</template>

<script>
export default {
  name: 'AddressForm',
  props: {
    isAddressSet: Boolean,
    canSameBilling: Boolean,
  },
  methods: {
    sendAddressForm() {
      let localAddress = {};
      localAddress.street =  document.getElementById('street').value;
      localAddress.postcode = document.getElementById('postcode').value;
      localAddress.city = document.getElementById('city').value;
      localAddress.region = document.getElementById('region').value;
      localAddress.country_code = document.getElementById('country').value;
      localAddress.samebilling = this.canSameBilling ? document.getElementById('samebilling').checked : null;

      this.$emit('send-form', localAddress);
    },
  }
}
</script>
