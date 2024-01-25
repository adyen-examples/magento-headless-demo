<template>
  <main class="payment-page" v-if="!options.loading">
    <div class="top-container">
      <div class="margin-container">
      </div>
      <div id="payment-page" class="store-container">
        <div class="forms" v-if="!options.loading">
          <div class="form-shopper-data">
            <DetailsForm
              :isDetailsSet="options.showShopperForm"
              :title="'Your Details'"
              :type="'shopper'"
              @send-form="setFormShopperData"
              @edit-form="onEditForm"
            />
          </div>
          <div class="form-shipping-data">
            <AddressForm
              :isAddressSet="options.showShippingForm"
              :canSameBilling="true"
              :title="'Shipping Address'"
              :type="'shipping'"
              :countryOptions="countryOptions"
              @send-form="setFormShippingAddress"
              @edit-form="onEditForm"
            />
          </div>
          <div class="form-billing-data">
            <AddressForm
              :isAddressSet="options.showBillingForm"
              :canSameBilling="false"
              :title="'Billing Address'"
              :type="'billing'"
              :countryOptions="countryOptions"
              @send-form="setFormBillingAddress"
              @edit-form="onEditForm"
            />
          </div>
          <div class="shipping-method-selector">
            <ShippingMethodForm
              :shippingMethods="checkoutData.shippingMethods"
              :type="'shipmethod'"
              :isShippingMethodSet="selectedShippingMethod != null"
              @send-form="onCheckBoxChange"
              @edit-form="onEditForm"
            />
          </div>
        </div>
        <div class="spinnerElement" v-else>
          <RefreshIcon/>
        </div>
      </div>
      <div class="summary-column">
        <Cart
          :cartItems="cart.cartItems"
          :cartTotal="cart.cartTotal"
          :cartActions="false"
          :shippingCosts="selectedShippingMethod"
          v-if="!options.loading"
        />
      </div>
    </div>
    <PaymentArea
      :paymentMethods="checkoutData.paymentMethods"
      :paymentMethodsResponse="checkoutData.paymentMethodsResponse"
      :selectedpm="selectedpm"
      @change-pm="onSelectPaymentMethod"
      v-if="selectedShippingMethod"
    />
  </main>
  <div class="spinnerElement" v-else>
    <RefreshIcon/>
  </div>
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
import ShippingMethodForm from '../../components/ShippingMethodForm.vue';
import PaymentArea from '../../components/PaymentArea.vue';

// Helpers
import * as graphql from '../../plugins/graphql.js';

if (process.client) {
  AdyenCheckout = require("@adyen/adyen-web");
}

export default {
  components: {
    PencilIcon,
    Cart,
    PaymentArea,
    AddressForm,
    DetailsForm,
    ShippingMethodForm,
    RefreshIcon,
  },
  props: {

  },
  data() {
    return {
      options: {
        loading: true,
        showShopperForm: true,
        showShippingForm: false,
        showBillingForm: false,
      },
      checkoutData: {
        checkout: '',
        paymentMethods: [],
        shippingMethods: [],
        paymentMethodsResponse: {},
        adyenStatusResponse: '',
        stateData:'',

      },
      cart: {
        cartId: '',
        cartItems: [],
        cartTotal: '',
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
      },
      selectedpm: '',
      selectedShippingMethod: null,
      countryOptions: [],
      orderId:'',
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

    await this.storage();
  },

  methods: {
    async storage() {
      this.cart.cartId = localStorage.getItem('cart');

      const cartResponse = await this.queryCart();
      this.cart.cartItems = cartResponse.cart.items;
      this.cart.cartTotal = cartResponse.cart.prices.grand_total.value.toFixed(2) + " " + cartResponse.cart.prices.grand_total.currency;

      if(cartResponse.cart.email) this.options.showShopperForm = false;

      this.updateShippingForm(cartResponse);
      this.updateBillingForm(cartResponse);

      const countryResponse = await graphql.getCountries();
      this.countryOptions = countryResponse.countries;

      this.options.loading = false;
    },

    //// HANDLERS
    // Changing ShippingMethod needs a refresh on PM list using new amount and cart info
    async onCheckBoxChange(event) {
      const shippingMethodId = event.target.id.substring(event.target.id.indexOf('-') + 1);
      const method = this.checkoutData.shippingMethods[shippingMethodId];
      const response = await this.setShippingMethod(method);
      await this.getPaymentMethods();
    },

    updateShippingForm(data) {
      const selectedShippingAddress = data.cart.shipping_addresses[0];

      if(!selectedShippingAddress)
        return;

      this.cart.shopperShippingAddress.firstName = selectedShippingAddress.firstname;
      this.cart.shopperShippingAddress.lastName = selectedShippingAddress.lastname;
      this.cart.shopperShippingAddress.street = selectedShippingAddress.street[0];
      this.cart.shopperShippingAddress.city = selectedShippingAddress.city;
      this.cart.shopperShippingAddress.region = selectedShippingAddress.region.label;
      this.cart.shopperShippingAddress.postcode = selectedShippingAddress.postcode;
      this.cart.shopperShippingAddress.country_code = selectedShippingAddress.country.code;
      this.cart.shopperShippingAddress.telephone = selectedShippingAddress.telephone;
      this.checkoutData.shippingMethods = selectedShippingAddress.available_shipping_methods;
      this.options.showShippingForm = false;
    },

    updateBillingForm(data) {
      const selectedBillingAddress = data.cart.billing_address;

      if(!selectedBillingAddress) return;

      this.cart.shopperBillingAddress.firstName = selectedBillingAddress.firstname;
      this.cart.shopperBillingAddress.lastName = selectedBillingAddress.lastname;
      this.cart.shopperBillingAddress.street = selectedBillingAddress.street[0];
      this.cart.shopperBillingAddress.city = selectedBillingAddress.city;
      this.cart.shopperBillingAddress.region = selectedBillingAddress.region.label;
      this.cart.shopperBillingAddress.postcode = selectedBillingAddress.postcode;
      this.cart.shopperBillingAddress.country_code = selectedBillingAddress.country.code;
      this.cart.shopperBillingAddress.telephone = selectedBillingAddress.telephone;
      this.options.showBillingForm = false;
    },

    onEditForm(form) {
      switch(form) {
        case "shopper":
          this.cart.shopperShippingAddress = {
            firstName: '',
            lastName: '',
            street: '',
            city: '',
            region: '',
            postcode: '',
            country_code: '',
            telephone: '',
          };
          this.options.showShopperForm = true;
          break;
        case "shipping":
          this.cart.shopperShippingAddress = {
            firstName: '',
            lastName: '',
            street: '',
            city: '',
            region: '',
            postcode: '',
            country_code: '',
            telephone: '',
          };
          this.options.showShippingForm = true;
          break;
        case "billing":
          this.cart.shopperBillingAddress = {
            firstName: '',
            lastName: '',
            street: '',
            city: '',
            region: '',
            postcode: '',
            country_code: '',
            telephone: '',
          };
          this.options.showBillingForm = true;
          break;
        case "shipmethod":
          this.selectedShippingMethod = null;
          this.checkoutData.paymentMethods = [];
          const inputs = document
            .getElementsByClassName("smethod")
            .forEach(input => input.checked = false);
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
      const response = await this.addGuestToCart(details.email);
      this.cart.shopperShippingAddress.firstName = details.firstName;
      this.cart.shopperShippingAddress.lastName = details.lastName;
      this.cart.shopperShippingAddress.telephone = details.telephone;

      this.cart.shopperBillingAddress.firstName = details.firstName;
      this.cart.shopperBillingAddress.lastName = details.lastName;
      this.cart.shopperBillingAddress.telephone = details.telephone;

      if(response.data.setGuestEmailOnCart.cart){
        this.options.showShopperForm = false;
        this.options.showShippingForm = true;
      }
    },

    // Save ShippingAddress form locally and set it on cart
    async setFormShippingAddress(address) {
      address.firstName = this.cart.shopperShippingAddress.firstName;
      address.lastName = this.cart.shopperShippingAddress.lastName;
      address.telephone = this.cart.shopperShippingAddress.telephone;
      const response = await this.setShippingAdress(address);

      if(response.cart){
        if(address.samebilling) {
          const responseSecond = await this.setBillingAddress(address);
          if(responseSecond.cart) {
            this.options.showBillingForm = false;
          }
        }
        else {
          this.cart.shopperBillingAddress.street == '' ? this.options.showBillingForm = true : null;
        }
        this.options.showShippingForm = false;
      }
    },

    // Save ShippingAddress form locally and set it on cart
    async setFormBillingAddress(address) {
      address.firstName = this.cart.shopperBillingAddress.firstName;
      address.lastName = this.cart.shopperBillingAddress.lastName;
      address.telephone = this.cart.shopperBillingAddress.telephone;
      this.cart.shopperBillingAddress.street =  address.street;
      this.cart.shopperBillingAddress.postcode = address.postcode;
      this.cart.shopperBillingAddress.city = address.city;
      this.cart.shopperBillingAddress.region = address.region;
      this.cart.shopperBillingAddress.country_code = address.country_code;
      let response = await this.setBillingAddress(address);
      if(response.cart){
        this.options.showBillingForm = false;
      }
    },

    // Create checkout config and mount checkout components
    async createConfig() {

      let configuration = {
        environment: 'test',
        clientKey: process.env.ADYEN_CLIENT_KEY,
        countryCode: this.cart.shopperBillingAddress.country_code,
        paymentMethodsResponse: this.checkoutData.paymentMethodsResponse,
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
      this.checkoutData.paymentMethods = this.checkoutData.paymentMethods.filter((pm, index) => !pmExclude.includes(pm.type));
      this.checkoutData.paymentMethodsResponse.paymentMethods = this.checkoutData.paymentMethodsResponse.paymentMethods.filter((pm, index) => !pmExclude.includes(pm.type));
      let schemeDuplicate = -1;
      let configs = this.checkoutData.paymentMethods.map((pm, index) => {
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
      this.checkoutData.checkout = checkout;

      // Mount config into each container
      this.checkoutData.paymentMethods.map((pm, index) => pm.type != 'scheme' ? checkout.create(pm.type, configuration).mount('#' + pm.type + '-container') : null);

    },

    // Function for components onchange listener (not used atm but can be used to show changes in state data
    handleOnChange(state, component) {
      this.checkoutData.stateData = state.data;
    },

    handleDetails(state, component) {
      let response = this.adyenDetails();
    },

    processResult(paymentStatus) {
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

    async handlePaymentError(error) {
      console.error(error);
      console.error("Payment was REFUSED");
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
        const response = await graphql.setPaymentMethodAndPlaceOrder(this.cart.cartId, state.data);
        this.orderId = response.order.order_id;
        const paymentStatus = response.order.adyen_payment_status;

        if (!paymentStatus.isFinal) {
          let pmtype = state.data.paymentMethod.type === "scheme" ? "card" : state.data.paymentMethod.type;
          this.checkoutData.checkout
            .createFromAction(JSON.parse(paymentStatus.action))
            .mount('#' + pmtype  + '-container');
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
        const payload = state.data;
        payload.orderId = this.orderId;

        const response = await graphql.getAdyenPaymentDetails(this.cart.cartId, JSON.stringify(payload));
        console.log(response.adyenPaymentDetails.resultCode);
        this.processResult(response.adyenPaymentDetails);

        return response;
      } catch (error) {
        this.handlePaymentError(error);
      }
    },

    // Query logic to get the current payment status
    async adyenStatus() {
      try {
        const response = await graphql.getAdyenPaymentStatus(this.cart.cartId, this.orderId);
        this.checkoutData.adyenStatusResponse = response;
        return response;

      } catch (error) {
        this.handlePaymentError(error);
      }
    },

    // Query logic to set guest email on Cart
    async addGuestToCart(shopperEmail) {
      try {
        const response = await graphql.setGuestEmailOnCart(this.cart.cartId, shopperEmail);
        return response;

      } catch (error) {
        console.error(error);
      }
    },

    // Query logic to set shipping address on Cart
    async setShippingAdress(address) {
      try {
        const response = await graphql.setShippingAddressesOnCart(this.cart.cartId, address);
        this.updateShippingForm(response);
        return response;

      } catch (error) {
        console.error("There was an error setting the Shipping Address");
      }
    },

    // Query logic to set billing address on Cart
    async setBillingAddress(address) {
      try {
        const response = await graphql.setBillingAddressOnCart(this.cart.cartId, address);
        this.updateBillingForm(response);
        return response;

      } catch (error) {
        console.error(error);
      }
    },

    // Query logic to set shipping method on Cart
    async setShippingMethod(method) {
      try {
        //set shippingmethod
        const response = await graphql.setShippingMethodsOnCart(this.cart.cartId, method);
        this.selectedShippingMethod = response.cart.shipping_addresses[0].selected_shipping_method;

        return response;
      } catch (error) {
        console.error(error);
      }
    },

    // Query logic to get available payment methods based on cart
    async getPaymentMethods() {
      try {
        const response = await graphql.getAdyenPaymentMethods(this.cart.cartId);
        this.checkoutData.paymentMethods = response.data.adyenPaymentMethods.paymentMethodsExtraDetails;
        this.checkoutData.paymentMethodsResponse = response.data.adyenPaymentMethods.paymentMethodsResponse;

        await this.createConfig();
        return response;

      } catch (error) {
        console.error(error);
      }
    },

    // Query current cart. Might use this instead of localStorage to retrieve active cart contents
    async queryCart() {
      try {
        const response = await graphql.queryCart(this.cart.cartId);
        return response.data;

      } catch (error) {
        console.error(error);
      }
    },

  },
};
</script>
