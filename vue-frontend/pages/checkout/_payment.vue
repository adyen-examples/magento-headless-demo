<template>
  <main class="payment-page">
    <div class="top-container">
      <div class="margin-container">
      </div>
      <div id="payment-page" class="store-container">
        <div class="forms">
          <div class="form-shopper-data">
            <div class="form-header">
              <h2> Your Details </h2>
              <div
                class="pencil-icon"
                v-if="shopperShippingAddress.firstName != ''"
                v-on:click="onEditForm('shopper')"
              >
                <PencilIcon/>
              </div>
            </div>
            <form v-if="shopperShippingAddress.firstName == ''">
              <label for="fname">First name:</label>
              <label for="lname">Last name:</label><br>
              <input type="text" id="fname" name="fname">
              <input type="text" id="lname" name="lname"><br>
              <label for="femail">Email:</label>
              <label for="fphone">Phone:</label><br>
              <input type="text" id="femail" name="femail">
              <input type="text" id="fphone" name="fphone"><br>
              <button type='button' @click="setFormShopperData()">Submit</button>
            </form>
          </div>
          <div class="form-shipping-data">
            <div class="form-header">
              <h2> Shipping Address </h2>
              <div
                class="pencil-icon"
                v-if="shopperShippingAddress.street != ''"
                v-on:click="onEditForm('shipping')"
              >
                <PencilIcon/>
              </div>
            </div>
            <AddressForm
              v-bind:isAddressSet="showShippingForm"
              v-bind:canSameBilling="true"
              @send-form="setFormShippingAddress"
            />
          </div>
          <div class="form-billing-data">
            <div class="form-header">
              <h2> Billing Address </h2>
              <div
                class="pencil-icon"
                v-if="shopperBillingAddress.street != ''"
                v-on:click="onEditForm('billing')"
              >
                <PencilIcon/>
              </div>
            </div>
            <AddressForm
              v-bind:isAddressSet="showBillingForm"
              v-bind:canSameBilling="false"
              @send-form="setFormBillingAddress"
            />
          </div>
          <div class="shipping-method-selector">
            <div class="form-header">
              <h2> Shipping Method Address </h2>
              <div class="pencil-icon">
                <RefreshIcon/>
              </div>
            </div>
            <div class="shipping-method-container" v-for="(meth, index) in this.shippingMethods" :key="index">
              <input type="radio" :id="'smethod-' + index" name="smethod" @change="onCheckBoxChange($event)">
              <label for="smethod"> {{meth.carrier_title}} - {{meth.method_title}}: + {{meth.amount.value}} {{meth.amount.currency}} </label><br>
            </div>
          </div>
        </div>
      </div>
      <div class="summary-column">
        <Cart
          v-bind:cartItems="cartItems"
          v-bind:cartTotal="cartTotal"
          v-bind:cartActions="false"
        />
      </div>
    </div>
    <PaymentArea
      v-bind:paymentMethods="paymentMethods"
      v-bind:paymentMethodsResponse="paymentMethodsResponse"
      v-bind:selectedpm="selectedpm"
      @change-pm="onSelectPaymentMethod"
    />
  </main>

</template>

<script>
let AdyenCheckout;
// CSS Files
import '@adyen/adyen-web/dist/adyen.css';
// Components
import PencilIcon from '../../components/PencilIcon.vue';
import RefreshIcon from '../../components/RefreshIcon.vue';
import Cart from '../../components/Cart.vue';
import AddressForm from '../../components/AddressForm.vue';
import PaymentArea from '../../components/PaymentArea.vue';
// Helpers
import * as graphql from '../../plugins/graphql.js';
if (process.client) {
  AdyenCheckout = require("@adyen/adyen-web");
}

export default {
  components: {
    PencilIcon,
    RefreshIcon,
    Cart,
    PaymentArea,
    AddressForm,
  },
  props: {

  },
  data() {
    return {
      cartId: '',
      redirectResult: '',
      checkout: '',
      selectedpm: '',
      paymentMethods: [],
      shippingMethods: [],
      adyenStatusResponse: '',
      paymentMethodsResponse: {},
      orderId:'',
      cartItems:[],
      cartTotal: '',
      stateData:'',
      showShopperForm: true,
      showShippingForm: true,
      showBillingForm: true,
      shopperBillingAddress: {
        firstName: '',
        lastName: '',
        street: '',
        city: '',
        country: '',
        region: '',
        postcode: '',
        country_code: '',
        phone: '',
      },
      shopperShippingAddress: {
        firstName: '',
        lastName: '',
        street: '',
        city: '',
        country: '',
        region: '',
        postcode: '',
        country_code: '',
        phone: '',
      },
    }
  },
  head() {
    return {
      title: "Checkout",
    };
  },

  asyncData({ route }) {
    return { type: route.params.payment };
  },
  created() {

  },
  async mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    this.redirectResult = urlParams.get('redirectResult');

    this.storage();
  },

  methods: {
    storage() {

      this.cartId = localStorage.getItem('cart');
      this.cartItems = JSON.parse(localStorage.getItem('cartItems'));

      let storedSA = localStorage.getItem('shipping');
      if (storedSA) {
        this.shopperShippingAddress = JSON.parse(storedSA);
      }
      let storedBA = localStorage.getItem('billing');
      if (storedBA) {
        this.shopperBillingAddress = JSON.parse(storedBA);
      }

      let storedShipMethods = localStorage.getItem('shipMethods');
      if(storedShipMethods){
        this.shippingMethods = JSON.parse(storedShipMethods);
      }

      let storedCartTotal = localStorage.getItem('cartTotal');
      if (storedCartTotal) {
        this.cartTotal = JSON.parse(storedCartTotal);
      }
    },

    //// HANDLERS
    // Changing ShippingMethod needs a refresh on PM list using new amount and cart info
    async onCheckBoxChange(event) {
      let method = this.shippingMethods[event.target.id.substring(event.target.id.indexOf('-') + 1)];
      let response = await this.setShippingMethod(method);

      await this.getPaymentMethods();
    },

    onEditForm(form) {
      switch(form) {
        case "shopper":
          this.shopperShippingAddress.firstName = '';
          this.shopperShippingAddress.lastName = '';
          this.shopperShippingAddress.phone = '';

          this.shopperBillingAddress.firstName = '';
          this.shopperBillingAddress.lastName = '';
          this.shopperBillingAddress.phone = '';
          break;
        case "shipping":
          this.shopperShippingAddress.street = '';
          this.shopperShippingAddress.city = '';
          this.shopperShippingAddress.country = '';
          this.shopperShippingAddress.postcode = '';
          this.shopperShippingAddress.region = '';
          this.shopperShippingAddress.country_code = '';
          break;
        case "billing":
          this.shopperBillingAddress.street = '';
          this.shopperBillingAddress.city = '';
          this.shopperBillingAddress.country = '';
          this.shopperBillingAddress.postcode = '';
          this.shopperBillingAddress.region = '';
          this.shopperBillingAddress.country_code = '';
          break;
      }

    },

    // Refreshing config when selecting new payment method from list
    onSelectPaymentMethod(type) {
      this.selectedpm = type;
      this.createConfig();
    },

    //// FORMS
    // Save ShopperData form locally and set guest email
    async setFormShopperData() {
      let firstName = document.getElementById('fname').value;
      let lastName = document.getElementById('lname').value;
      let email = document.getElementById('femail').value;
      let phone = document.getElementById('fphone').value;

      let response = await this.addGuestToCart(email);

      this.shopperShippingAddress.firstName = firstName;
      this.shopperShippingAddress.lastName = lastName;
      this.shopperShippingAddress.phone = phone;

      this.shopperBillingAddress.firstName = firstName;
      this.shopperBillingAddress.lastName = lastName;
      this.shopperBillingAddress.phone = phone;

      if(response.data.setGuestEmailOnCart.cart){
        if(this.shopperShippingAddress.street){
          await this.setShippingAdress();
        }
        if(this.shopperBillingAddress.street){
          await this.setBillingAddress();
        }
        document.getElementsByClassName("form-shopper-data")[0].classList.add("collapsed");
        document.getElementsByClassName("form-shipping-data")[0].classList.remove("collapsed");
      }

    },

    // Save ShippingAddress form locally and set it on cart
    async setFormShippingAddress(address) {
      this.shopperShippingAddress.street =  address.street;
      this.shopperShippingAddress.postcode = address.postcode;
      this.shopperShippingAddress.city = address.city;
      this.shopperShippingAddress.region = address.region;
      this.shopperShippingAddress.country_code = address.country_code;
      // let sameBilling = document.getElementById('samebilling').checked;
      console.log(address);

      const response = await this.setShippingAdress();

      if(response.cart){
        if(address.samebilling) {
          this.shopperBillingAddress.street =  this.shopperShippingAddress.street;
          this.shopperBillingAddress.postcode = this.shopperShippingAddress.postcode;
          this.shopperBillingAddress.city = this.shopperShippingAddress.city;
          this.shopperBillingAddress.region = this.shopperShippingAddress.region;
          this.shopperBillingAddress.country_code = this.shopperShippingAddress.country_code;

          const responseSecond = await this.setBillingAddress();
          if(responseSecond.cart) {
            localStorage.setItem("billing", JSON.stringify(this.shopperBillingAddress));
            this.showBillingForm = false;
          }
        }
        else {
          this.showBillingForm = true;
        }

        localStorage.setItem("shipping", JSON.stringify(this.shopperShippingAddress));
        this.showShippingForm = false;
      }
    },

    // Save ShippingAddress form locally and set it on cart
    async setFormBillingAddress(address) {
      this.shopperBillingAddress.street =  address.street;
      this.shopperBillingAddress.postcode = address.postcode;
      this.shopperBillingAddress.city = address.city;
      this.shopperBillingAddress.region = address.region;
      this.shopperBillingAddress.country_code = address.country_code;

      let response = await this.setBillingAddress();

      if(response.cart){
        //document.getElementsByClassName("form-billing-data")[0].classList.add("collapsed");
        this.showBillingForm = false;
        localStorage.setItem("billing", JSON.stringify(this.shopperBillingAddress));
      }
    },

    // Create checkout config and mount checkout components
    async createConfig() {

      let configuration = {
        environment: 'test',
        clientKey: process.env.ADYEN_CLIENT_KEY,
        countryCode: this.shopperBillingAddress.country_code,
        paymentMethodsResponse: this.paymentMethodsResponse,
        onPaymentCompleted: (result, component) => {
          console.info(result, component);
        },
        onChange: this.handleOnChange,
        onAdditionalDetails: await this.adyenDetails,
        onError: (error, component) => {
          console.error(error.name, error.message, error.stack, component);
        },
        onSubmit: this.placeOrder,
        paymentMethodsConfiguration: {

        }
      };

      const pmExclude = ['alipay', 'unionpay', 'applepay', 'c_cash', 'wechatpayQR', 'genericgiftcard', 'givex', 'bankTransfer_NL', 'ratepay', 'paypal', 'giftcard', 'eps', 'sepadirectdebit', 'multibanco'];
      this.paymentMethods = this.paymentMethods.filter((pm, index) => !pmExclude.includes(pm.type));
      this.paymentMethodsResponse.paymentMethods = this.paymentMethodsResponse.paymentMethods.filter((pm, index) => !pmExclude.includes(pm.type));
      let schemeDuplicate = -1;
      let configs = this.paymentMethods.map((pm, index) => {
        if (pm.configuration) {
          if(pm.type == 'scheme'){
            pm.type = 'card';
            schemeDuplicate = index;
          }
          configuration['paymentMethodsConfiguration'][pm.type] = pm.configuration;
          configuration['paymentMethodsConfiguration'][pm.type]['showPayButton'] = true;
        }
      });
      console.log(configuration['paymentMethodsConfiguration']);
      console.log(this.paymentMethods);
      // Remove the duplicated pm object scheme (seems like not needed);
      //schemeDuplicate != -1 ? this.paymentMethods = this.paymentMethods.filter((pm, index) => index != schemeDuplicate) : null;

      const checkout = await AdyenCheckout(configuration);
      this.checkout = checkout;

      // Mount config into each container
      this.paymentMethods.map((pm, index) => pm.type != 'scheme' ? checkout.create(pm.type, configuration).mount('#' + pm.type + '-container') : null);

    },

    // Function for components onchange listener (not used atm but can be used to show changes in state data
    handleOnChange(state, component) {
      this.stateData = state.data;
    },

    handleDetails(state, component){
      let response = this.adyenDetails();
    },

    processResult(paymentStatus){
      localStorage.setItem('orderNumber', this.orderId);
      localStorage.setItem('resultCode', paymentStatus.resultCode);

      switch (paymentStatus.resultCode) {
        case "Authorised":
          window.location.href = window.location.origin + '/result/success';
          break;
        case "Pending":
        case "Received":
          window.location.href = window.location.origin + '/result/pending';
          break;
        case "Refused":
          window.location.href = window.location.origin + '/result/failed';
          break;
        default:
          window.location.href = window.location.origin + '/result/error';
          break;
      }
    },

    async handlePaymentError(error){
      console.error(error);
      alert("Payment was REFUSED");
      await this.getPaymentMethods();

    },

    // GRAPHQL HANDLERS
    /**
     * Retrieves the cartId and state.data, calls graphql setPaymentMethodAndPlaceOrder and handles the response
     * @param {object} state of the component
     * @param {object} component in question
     * @returns response from graphql
     */
    async placeOrder(state, component) {
      try {
        const cartId = this.cartId;
        const response = await graphql.setPaymentMethodAndPlaceOrder(cartId, state.data);
        this.orderId = response.order.order_id;
        let paymentStatus = response.order.adyen_payment_status;

        if (!paymentStatus.isFinal) {
          let pmtype = state.data.paymentMethod.type === "scheme" ? "card" : state.data.paymentMethod.type;
          this.checkout.createFromAction(JSON.parse(paymentStatus.action)).mount('#' + pmtype  + '-container');
        } else {
          this.processResult(paymentStatus);
        }
        return response;

      } catch (error) {
        this.handlePaymentError(error);
      }
    },

    // Query logic to get the adyen details of the transaction
    async adyenDetails(state, component) {
      try {
        const cartId = this.cartId;
        const orderId = this.orderId;
        let payload = state.data;
        payload.orderId = orderId;
        payload = JSON.stringify(payload);

        // RESPONSE STRUCT: { "adyenPaymentDetails": { "isFinal": true, "resultCode": "Authorised", "additionalData": null, "action": null } }
        const response = graphql.getAdyenPaymentDetails(cartId, payload);
        alert(response.data.adyenPaymentDetails.resultCode);
        this.processResult(response.data.adyenPaymentDetails);

        return response;
      } catch (error) {
        this.handlePaymentError(error);
      }
    },

    // Query logic to get the current payment status
    async adyenStatus() {
      try {
        const cartId = this.cartId;
        const orderId = this.orderId;

        const response = graphql.getAdyenPaymentStatus(cartId, orderId);
        this.adyenStatusResponse  = response;
        return response;

      } catch (error) {
        this.handlePaymentError(error);
      }
    },

    // Query logic to set guest email on Cart
    async addGuestToCart(shopperEmail) {
      try {
        const cartId = this.cartId;
        const response = await graphql.setGuestEmailOnCart(cartId, shopperEmail);
        return response;

      } catch (error) {
        console.error(error);
      }
    },

    // Query logic to set shipping address on Cart
    async setShippingAdress() {
      try {
        const cartId = this.cartId;

        const response = await graphql.setShippingAddressesOnCart(cartId, this.shopperShippingAddress);
        this.shippingMethods = response.cart.shipping_addresses[0].available_shipping_methods;
        localStorage.setItem("shipMethods", JSON.stringify(this.shippingMethods));
        return response;

      } catch (error) {
        console.error(error);
      }
    },

    // Query logic to set billing address on Cart
    async setBillingAddress() {
      try {
        const cartId = this.cartId;
        const response = await graphql.setBillingAddressOnCart(cartId, this.shopperBillingAddress);
        return response;

      } catch (error) {
        console.error(error);
      }
    },

    // Query logic to set shipping method on Cart
    async setShippingMethod(method) {
      try {
        const cartId = this.cartId;

        //set shippingmethod
        const response = await graphql.setShippingMethodsOnCart(cartId, method);
        const carty = await graphql.queryCart(cartId);
        console.log(carty);
        return response;

      } catch (error) {
        console.error(error);
      }
    },

    // Query logic to get available payment methods based on cart
    async getPaymentMethods() {
      try {
        const cartId = this.cartId;
        const response = await graphql.getAdyenPaymentMethods(cartId);

        this.paymentMethods = response.data.adyenPaymentMethods.paymentMethodsExtraDetails;
        this.paymentMethodsResponse = response.data.adyenPaymentMethods.paymentMethodsResponse;

        await this.createConfig();
        return response;

      } catch (error) {
        console.error(error);
      }
    },

    async queryCart() {
      try {
        const cartId = this.cartId;
        const response = await graphql.queryCart(data);
        return response;

      } catch (error) {
        console.error(error);
      }
    },

  },
};
</script>
