<template>
  <div>
    <div class="form-header">
      <h2> {{title}}  </h2>
      <div
        class="pencil-icon"
        v-if="!isDetailsSet"
        v-on:click="onEdit()"
      >
        <PencilIcon/>
      </div>
    </div>
    <form v-if="isDetailsSet">
      <label for="firstName">
        First name:
      </label>
      <label for="lastName">
        Last name:
      </label><br>
      <input type="text" id="firstName" name="firstName"/>
      <input type="text" id="lastName" name="lastName"/><br>
      <label for="email">
        Email:
      </label>
      <label for="phoneNumber">
        Phone:
      </label><br>
      <input type="text" id="email" name="email"/>
      <input type="text" id="phoneNumber" name="phoneNumber"/><br>
      <button type='button' @click="sendDetailsForm()">
        Submit
      </button>
    </form>
  </div>
</template>

<script>
import PencilIcon from './PencilIcon.vue';

export default {
  name: 'DetailsForm',
  components: {
    PencilIcon,
  },
  props: {
    isDetailsSet: Boolean,
    title: String,
    type: String,
  },
  methods: {

    // Emit the send-form event to parent component, sending the form values in object format
    sendDetailsForm() {
      let localDetails = {};
      localDetails.firstName = document.getElementById('firstName').value;
      localDetails.lastName = document.getElementById('lastName').value;
      localDetails.email = document.getElementById('email').value;
      localDetails.telephone = document.getElementById('phoneNumber').value;

      this.$emit('send-form', localDetails);
    },

    // Emit the edit-form event to parent component. Triggers the form clear function that depends on the form type
    onEdit() {
      this.$emit('edit-form', this.type);
    },
  }
}
</script>
