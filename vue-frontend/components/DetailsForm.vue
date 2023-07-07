<template>
  <form v-if="isDetailsSet">
    <label for="firstName">First name:</label>
    <label for="lastName">Last name:</label><br>
    <input type="text" id="firstName" name="firstName">
    <input type="text" id="lastName" name="lastName"><br>
    <label for="email">Email:</label>
    <label for="phoneNumber">Phone:</label><br>
    <input type="text" id="email" name="email">
    <input type="text" id="phoneNumber" name="phoneNumber"><br>
    <button type='button' @click="sendDetailsForm()">Submit</button>
  </form>
</template>

<script>
export default {
  name: 'AddressForm',
  props: {
    isDetailsSet: Boolean,
  },
  methods: {
    sendDetailsForm() {
      let localDetails = {};
      localDetails.firstName = document.getElementById('firstName').value;
      localDetails.lastName = document.getElementById('lastName').value;
      localDetails.email = document.getElementById('email').value;
      localDetails.phone = document.getElementById('phoneNumber').value;

      this.$emit('send-form', localDetails);
    },
  }
}
</script>
