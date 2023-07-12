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
      <select id="region" name="region">
        <option :value="' '"> None </option>
        <option
          v-for="region in regionOptions"
          :key="region.code"
          :value="region.code"
        >
          {{region.name}}
        </option>
      </select><br>
      <label for="country">Country</label>
      <label v-if="canSameBilling" for="samebilling" id="checkbox-label">Same as Billing</label><br>
      <select id="country" name="country" @change="onCountrySelect($event)">
        <option :value="' '"> None </option>
        <option
          v-for="country in countryOptions"
          :key="country.id"
          :value="country.id"
        >
          {{country.full_name_english != null ? country.full_name_english : country.full_name_locale}} {{'(' + country.id + ')'}}
        </option>
      </select>
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
    countryOptions: Array,
  },

  data() {
    return {
      regionOptions: Array,
    }
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
    onCountrySelect($event) {
      let country_code = document.getElementById('country').value;
      this.regionOptions = this.countryOptions.filter(c => c.id == country_code)[0].available_regions;
    }
  }
}
</script>
