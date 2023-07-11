<template>
  <div>
    <div class="form-header">
      <h2> {{title}}  </h2>
      <div
        class="pencil-icon"
        v-if="!isAddressSet"
        v-on:click="onEdit()"
      >
        <PencilIcon/>
      </div>
    </div>
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
      <label v-if="canSameBilling" for="samebilling" id="checkbox-label">Same as Billing</label><br>
      <input type="text" id="country" name="country">
      <input v-if="canSameBilling" type="checkbox" id="samebilling" name="samebilling"><br>
      <button type='button' @click="sendAddressForm()">Submit</button>
    </form>
  </div>
</template>

<script>
import PencilIcon from './PencilIcon.vue';

export default {
  name: 'AddressForm',
  components: {
    PencilIcon,
  },
  props: {
    isAddressSet: Boolean,
    canSameBilling: Boolean,
    title: String,
    type: String,
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
    onEdit() {
      this.$emit('edit-form', this.type);
    },
  }
}
</script>
