<template>
  <main class="payment-page">
    <div class="top-container">
      <div class="margin-container">
      </div>
      <div id="payment-page" class="store-container">
        <div class="forms">
          <div class="form-shopper-data">
            <DetailsForm
              :isDetailsSet="showShopperForm"
              :title="'Your Details'"
              :type="'shopper'"
              @send-form="setFormShopperData"
              @edit-form="onEditForm"
            />
          </div>
          <div class="form-shipping-data">
            <AddressForm
              :isAddressSet="showShippingForm"
              :canSameBilling="true"
              :title="'Shipping Address'"
              :type="'shipping'"
              @send-form="setFormShippingAddress"
              @edit-form="onEditForm"
            />
          </div>
          <div class="form-billing-data">
            <AddressForm
              :isAddressSet="showBillingForm"
              :canSameBilling="false"
              :title="'Billing Address'"
              :type="'billing'"
              @send-form="setFormBillingAddress"
              @edit-form="onEditForm"
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
              <label for="smethod"> {{meth.carrier_title}} - {{meth.method_title}}: + {{meth.amount.value.toFixed(2)}} {{meth.amount.currency}} </label><br>
            </div>
          </div>
        </div>
      </div>
      <div class="summary-column">
        <Cart
          :cartItems="cartItems"
          :cartTotal="cartTotal"
          :cartActions="false"
          :shippingCosts="selectedShippingMethod"
        />
      </div>
    </div>
    <PaymentArea
      :paymentMethods="paymentMethods"
      :paymentMethodsResponse="paymentMethodsResponse"
      :selectedpm="selectedpm"
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
import DetailsForm from '../../components/DetailsForm.vue';
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
    DetailsForm
  },
  props: {

  },
  data() {
    return {
      checkout: '',
      selectedpm: '',
      selectedShippingMethod: null,
      paymentMethods: [],
      shippingMethods: [],
      adyenStatusResponse: '',
      paymentMethodsResponse: {},
      orderId:'',
      stateData:'',
      cartId: '',
      cartItems:[],
      cartTotal: '',
      showShopperForm: true,
      showShippingForm: true,
      showBillingForm: true,
      shopperBillingAddress: {
        firstName: '',
        lastName: '',
        street: '',
        city: '',
        region: '',
        postcode: '',
        country_code: '',
        telephone: '',
      },
      shopperShippingAddress: {
        firstName: '',
        lastName: '',
        street: '',
        city: '',
        region: '',
        postcode: '',
        country_code: '',
        telephone: '',
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

    this.storage();
  },

  methods: {
    async storage() {

      this.cartId = localStorage.getItem('cart');
      const response = await this.queryCart();

      this.cartItems = response.cart.items;
      this.cartTotal = response.cart.prices.grand_total.value.toFixed(2) + " " + response.cart.prices.grand_total.currency;

      if(response.cart.email) {
        this.showShopperForm = false;
      }
      this.updateShippingForm(response);
      this.updateBillingForm(response);

    },

    //// HANDLERS
    // Changing ShippingMethod needs a refresh on PM list using new amount and cart info
    async onCheckBoxChange(event) {
      let method = this.shippingMethods[event.target.id.substring(event.target.id.indexOf('-') + 1)];
      let response = await this.setShippingMethod(method);
      await this.getPaymentMethods();
    },

    updateShippingForm(data){
      if(data.cart.shipping_addresses.length > 0) {
        this.shopperShippingAddress.firstName = data.cart.shipping_addresses[0].firstname;
        this.shopperShippingAddress.lastName = data.cart.shipping_addresses[0].lastname;
        this.shopperShippingAddress.street = data.cart.shipping_addresses[0].street[0];
        this.shopperShippingAddress.city = data.cart.shipping_addresses[0].city;
        this.shopperShippingAddress.region = data.cart.shipping_addresses[0].region.label;
        this.shopperShippingAddress.postcode = data.cart.shipping_addresses[0].postcode;
        this.shopperShippingAddress.country_code = data.cart.shipping_addresses[0].country.code;
        this.shopperShippingAddress.telephone = data.cart.shipping_addresses[0].telephone;
        this.shippingMethods = data.cart.shipping_addresses[0].available_shipping_methods;
        this.showShippingForm = false;
        this.selected_shipping_method = data.cart.shipping_addresses[0].selected_shipping_method != null ? data.cart.shipping_addresses[0].selected_shipping_method : null;
      }
    },

    updateBillingForm(data) {
      if(data.cart.billing_address != null) {
        this.shopperBillingAddress.firstName = data.cart.billing_address.firstname;
        this.shopperBillingAddress.lastName = data.cart.billing_address.lastname;
        this.shopperBillingAddress.street = data.cart.billing_address.street[0];
        this.shopperBillingAddress.city = data.cart.billing_address.city;
        this.shopperBillingAddress.region = data.cart.billing_address.region.label;
        this.shopperBillingAddress.postcode = data.cart.billing_address.postcode;
        this.shopperBillingAddress.country_code = data.cart.billing_address.country.code;
        this.shopperBillingAddress.telephone = data.cart.billing_address.telephone;
        this.showBillingForm = false;
      }
    },

    onEditForm(form) {
      switch(form) {
        case "shopper":
          this.shopperShippingAddress.firstName = '';
          this.shopperShippingAddress.lastName = '';
          this.shopperShippingAddress.telephone = '';

          this.shopperBillingAddress.firstName = '';
          this.shopperBillingAddress.lastName = '';
          this.shopperBillingAddress.telephone = '';
          this.showShopperForm = true;
          break;
        case "shipping":
          this.shopperShippingAddress.street = '';
          this.shopperShippingAddress.city = '';
          this.shopperShippingAddress.postcode = '';
          this.shopperShippingAddress.region = '';
          this.shopperShippingAddress.country_code = '';
          this.showShippingForm = true;
          break;
        case "billing":
          this.shopperBillingAddress.street = '';
          this.shopperBillingAddress.city = '';
          this.shopperBillingAddress.postcode = '';
          this.shopperBillingAddress.region = '';
          this.shopperBillingAddress.country_code = '';
          this.showBillingForm = true;
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
    async setFormShopperData(details) {
      let response = await this.addGuestToCart(details.email);
      this.shopperShippingAddress.firstName = details.firstName;
      this.shopperShippingAddress.lastName = details.lastName;
      this.shopperShippingAddress.telephone = details.telephone;

      this.shopperBillingAddress.firstName = details.firstName;
      this.shopperBillingAddress.lastName = details.lastName;
      this.shopperBillingAddress.telephone = details.telephone;

      if(response.data.setGuestEmailOnCart.cart){
        this.showShopperForm = false;
        this.showShippingForm = true;
      }
    },

    // Save ShippingAddress form locally and set it on cart
    async setFormShippingAddress(address) {
      address.firstName = this.shopperShippingAddress.firstName;
      address.lastName = this.shopperShippingAddress.lastName;
      address.telephone = this.shopperShippingAddress.telephone;
      const response = await this.setShippingAdress(address);

      if(response.cart){
        if(address.samebilling) {
          const responseSecond = await this.setBillingAddress(address);
          if(responseSecond.cart) {
            this.showBillingForm = false;
          }
        }
        else {
          this.shopperBillingAddress.street == '' ? this.showBillingForm = true : null;
        }
        this.showShippingForm = false;
      }
    },

    // Save ShippingAddress form locally and set it on cart
    async setFormBillingAddress(address) {
      address.firstName = this.shopperBillingAddress.firstName;
      address.lastName = this.shopperBillingAddress.lastName;
      address.telephone = this.shopperBillingAddress.telephone;
      this.shopperBillingAddress.street =  address.street;
      this.shopperBillingAddress.postcode = address.postcode;
      this.shopperBillingAddress.city = address.city;
      this.shopperBillingAddress.region = address.region;
      this.shopperBillingAddress.country_code = address.country_code;
      let response = await this.setBillingAddress(address);
      if(response.cart){
        this.showBillingForm = false;
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

      const pmExclude = ['applepay', 'c_cash', 'paypal', 'genericgiftcard', 'givex'];
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

        const response = await graphql.getAdyenPaymentDetails(cartId,  JSON.stringify(payload));
        alert(response.adyenPaymentDetails.resultCode);
        this.processResult(response.adyenPaymentDetails);

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

        const response = await graphql.getAdyenPaymentStatus(cartId, orderId);
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
    async setShippingAdress(address) {
      try {
        const cartId = this.cartId;
        const response = await graphql.setShippingAddressesOnCart(cartId, address);
        this.updateShippingForm(response);
        return response;

      } catch (error) {
        console.error(error);
      }
    },

    // Query logic to set billing address on Cart
    async setBillingAddress(address) {
      try {
        const cartId = this.cartId;
        const response = await graphql.setBillingAddressOnCart(cartId, address);
        this.updateBillingForm(response);
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
        this.selectedShippingMethod = response.cart.shipping_addresses[0].selected_shipping_method;

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

    // Query current cart. Might use this instead of localStorage to retrieve active cart contents
    async queryCart() {
      try {
        const cartId = this.cartId;
        const response = await graphql.queryCart(cartId);
        return response.data;

      } catch (error) {
        console.error(error);
      }
    },

  },
};
</script>
