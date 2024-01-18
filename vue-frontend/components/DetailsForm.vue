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
      <input type="text"
        id="firstName"
        name="firstName"
        v-model="firstName.value"
      />
      <input
        type="text"
        id="lastName"
        name="lastName"
        v-model="lastName.value"
      /><br>
      <label for="email">
        Email:
      </label>
      <label for="phoneNumber">
        Phone:
      </label><br>
      <input
        type="email"
        id="email"
        name="email"
        v-model="email.value"
      />
      <input
        type="phone"
        id="phoneNumber"
        name="phoneNumber"
        v-model="phoneNumber.value"
      /><br>
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
  data() {
    return {
      formIsValid: true,
      error: {
        fields: [],
        msg: 'Please make sure that the fields are not empty or have the wrong values'
      },
      firstName: {
        value: '',
        isValid: true,
      },
      lastName: {
        value: '',
        isValid: true,
      },
      email: {
        value: '',
        isValid: true,
      },
      phoneNumber: {
        value: '',
        isValid: true,
      }
    };
  },
  methods: {
    // Emit the send-form event to parent component, sending the form values in object format
    sendDetailsForm() {
      if(
        !this.firstName.isValid ||
        !this.lastName.isValid ||
        !this.email.isValid ||
        !this.phoneNumber.isValid
      ) {
        // this validation so far does nothing, but for the future
        this.formIsValid = false;
        return;
      }

      // Construct object and emit
      const localDetails = {};
      localDetails.firstName = this.firstName.value;
      localDetails.lastName = this.lastName.value;
      localDetails.email = this.email.value;
      localDetails.telephone = this.phoneNumber.value;

      this.$emit('send-form', localDetails);
    },

    // Emit the edit-form event to parent component.
    // Triggers the form clear function that depends on the form type
    onEdit() {
      this.$emit('edit-form', this.type);
    },
  }
}
</script>
