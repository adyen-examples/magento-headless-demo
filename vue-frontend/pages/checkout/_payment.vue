<template>
  <div>
    <div id="payment-page">
      <div class="forms">
        <div class="form-shopper-data">
          <div class="form-header">
            <h2> Your Details </h2>
            <div class="pencil-icon" v-if="shopperShippingAddress.firstName != ''" v-on:click="onEditForm('shopper')">
              <svg width="30" height="30" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_3675_44516)">
                  <path d="M38.9202 8.63018L31.3719 1.08179C30.5962 0.306069 29.3332 0.306069 28.5575 1.08179L3.59558 26.0442C3.33701 26.3028 3.15801 26.621 3.0685 26.9691L0.562364 37.0237C0.3933 37.7099 0.582254 38.416 1.08945 38.9132C1.46736 39.2911 1.97455 39.5 2.49169 39.5C2.65081 39.5 2.81988 39.4801 2.979 39.4403L13.0334 36.9242C13.3814 36.8347 13.6997 36.6557 13.9583 36.3971L38.9202 11.4447C39.6959 10.6689 39.6959 9.4059 38.9202 8.63018ZM9.4134 35.7805L7.80231 36.1883L3.82432 32.2102L4.64975 28.8885L9.87087 34.1097C10.4178 34.6567 10.1593 35.5915 9.4134 35.7805ZM2.49169 37.511L3.25746 34.4578L5.5448 36.7452L2.49169 37.511ZM13.0632 34.4876L6.22106 27.6454C5.83321 27.2575 5.83321 26.6309 6.22106 26.2431L24.9972 7.46659L31.8393 14.3089C32.2272 14.6967 32.2272 15.3233 31.8393 15.7111L13.0632 34.4876ZM33.9477 13.6028L27.1055 6.76049C26.7177 6.37263 26.7177 5.74608 27.1055 5.35822L29.9697 2.49401L36.8118 9.33629C37.1997 9.72415 37.1997 10.3507 36.8118 10.7386L33.9477 13.6028Z" fill="#00112C"/>
                </g>
                <defs>
                  <clipPath id="clip0_3675_44516">
                    <rect width="39" height="39" fill="white" transform="translate(0.501953 0.5)"/>
                  </clipPath>
                </defs>
              </svg>
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
            <div class="pencil-icon" v-if="shopperShippingAddress.street != ''" v-on:click="onEditForm('shipping')">
              <svg width="30" height="30" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_3675_44516)">
                  <path d="M38.9202 8.63018L31.3719 1.08179C30.5962 0.306069 29.3332 0.306069 28.5575 1.08179L3.59558 26.0442C3.33701 26.3028 3.15801 26.621 3.0685 26.9691L0.562364 37.0237C0.3933 37.7099 0.582254 38.416 1.08945 38.9132C1.46736 39.2911 1.97455 39.5 2.49169 39.5C2.65081 39.5 2.81988 39.4801 2.979 39.4403L13.0334 36.9242C13.3814 36.8347 13.6997 36.6557 13.9583 36.3971L38.9202 11.4447C39.6959 10.6689 39.6959 9.4059 38.9202 8.63018ZM9.4134 35.7805L7.80231 36.1883L3.82432 32.2102L4.64975 28.8885L9.87087 34.1097C10.4178 34.6567 10.1593 35.5915 9.4134 35.7805ZM2.49169 37.511L3.25746 34.4578L5.5448 36.7452L2.49169 37.511ZM13.0632 34.4876L6.22106 27.6454C5.83321 27.2575 5.83321 26.6309 6.22106 26.2431L24.9972 7.46659L31.8393 14.3089C32.2272 14.6967 32.2272 15.3233 31.8393 15.7111L13.0632 34.4876ZM33.9477 13.6028L27.1055 6.76049C26.7177 6.37263 26.7177 5.74608 27.1055 5.35822L29.9697 2.49401L36.8118 9.33629C37.1997 9.72415 37.1997 10.3507 36.8118 10.7386L33.9477 13.6028Z" fill="#00112C"/>
                </g>
                <defs>
                  <clipPath id="clip0_3675_44516">
                    <rect width="39" height="39" fill="white" transform="translate(0.501953 0.5)"/>
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
          <form v-if="shopperShippingAddress.street == ''">
            <label for="fstreet">Street:</label>
            <label for="fpostcode">Postcode</label><br>
            <input type="text" id="fstreet" name="fstreet">
            <input type="text" id="fpostcode" name="fpostcode"><br>
            <label for="fcity">City:</label>
            <label for="fregion">Region</label><br>
            <input type="text" id="fcity" name="fcity">
            <input type="text" id="fregion" name="fregion"><br>
            <label for="fcountry">Country</label>
            <label for="samebilling" id="checkbox-label">Same as Billing</label>
            <input type="checkbox" id="samebilling" name="samebilling"><br>
            <input type="text" id="fcountry" name="fcountry"><br>
            <button type='button' @click="setFormShippingAddress()">Submit</button>
          </form>
        </div>
        <div class="form-billing-data">
          <div class="form-header">
            <h2> Billing Address </h2>
            <div class="pencil-icon" v-if="shopperBillingAddress.street != ''" v-on:click="onEditForm('billing')">
              <svg width="30" height="30" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_3675_44516)">
                  <path d="M38.9202 8.63018L31.3719 1.08179C30.5962 0.306069 29.3332 0.306069 28.5575 1.08179L3.59558 26.0442C3.33701 26.3028 3.15801 26.621 3.0685 26.9691L0.562364 37.0237C0.3933 37.7099 0.582254 38.416 1.08945 38.9132C1.46736 39.2911 1.97455 39.5 2.49169 39.5C2.65081 39.5 2.81988 39.4801 2.979 39.4403L13.0334 36.9242C13.3814 36.8347 13.6997 36.6557 13.9583 36.3971L38.9202 11.4447C39.6959 10.6689 39.6959 9.4059 38.9202 8.63018ZM9.4134 35.7805L7.80231 36.1883L3.82432 32.2102L4.64975 28.8885L9.87087 34.1097C10.4178 34.6567 10.1593 35.5915 9.4134 35.7805ZM2.49169 37.511L3.25746 34.4578L5.5448 36.7452L2.49169 37.511ZM13.0632 34.4876L6.22106 27.6454C5.83321 27.2575 5.83321 26.6309 6.22106 26.2431L24.9972 7.46659L31.8393 14.3089C32.2272 14.6967 32.2272 15.3233 31.8393 15.7111L13.0632 34.4876ZM33.9477 13.6028L27.1055 6.76049C26.7177 6.37263 26.7177 5.74608 27.1055 5.35822L29.9697 2.49401L36.8118 9.33629C37.1997 9.72415 37.1997 10.3507 36.8118 10.7386L33.9477 13.6028Z" fill="#00112C"/>
                </g>
                <defs>
                  <clipPath id="clip0_3675_44516">
                    <rect width="39" height="39" fill="white" transform="translate(0.501953 0.5)"/>
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
          <form v-if="shopperBillingAddress.street == ''">
            <label for="fbstreet">Street:</label>
            <label for="fbpostcode">Postcode</label><br>
            <input type="text" id="fbstreet" name="fstreet">
            <input type="text" id="fbpostcode" name="fpostcode"><br>
            <label for="fbcity">City:</label>
            <label for="fbregion">Region</label><br>
            <input type="text" id="fbcity" name="fbcity">
            <input type="text" id="fbregion" name="fbregion"><br>
            <label for="fbcountry">Country</label><br>
            <input type="text" id="fbcountry" name="fbcountry"><br>
            <button type='button' @click="setFormBillingAddress()">Submit</button>
          </form>
        </div>
        <div class="shipping-method-selector">
          <div class="form-header">
            <h2> Shipping Method Address </h2>
            <div class="pencil-icon">
              <svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_3659_123)">
                  <path d="M3.46063 24.0015C3.46063 23.4515 3.01063 23.0015 2.46063 23.0015C1.91063 23.0015 1.46063 23.4515 1.46063 24.0015C1.46063 24.5515 1.91063 25.0015 2.46063 25.0015C3.01063 25.0015 3.46063 24.5515 3.46063 24.0015Z" fill="#00112C"/>
                  <path d="M36.1006 13.0015C36.6506 13.0015 37.1006 12.5515 37.1006 12.0015C37.1006 11.4515 36.6506 11.0015 36.1006 11.0015C35.5506 11.0015 35.1006 11.4515 35.1006 12.0015C35.1006 12.5515 35.5506 13.0015 36.1006 13.0015Z" fill="#00112C"/>
                  <path d="M36.5306 16.0015C36.5306 16.5515 36.9806 17.0015 37.5306 17.0015C38.0806 17.0015 38.5306 16.5515 38.5306 16.0015C38.5306 15.4515 38.0806 15.0015 37.5306 15.0015C36.9806 15.0015 36.5306 15.4515 36.5306 16.0015Z" fill="#00112C"/>
                  <path d="M3.88062 29.0115C4.4329 29.0115 4.88062 28.5638 4.88062 28.0115C4.88062 27.4592 4.4329 27.0115 3.88062 27.0115C3.32833 27.0115 2.88062 27.4592 2.88062 28.0115C2.88062 28.5638 3.32833 29.0115 3.88062 29.0115Z" fill="#00112C"/>
                  <path d="M3.00061 20.0015C3.00061 10.6315 10.6306 3.00146 20.0006 3.00146C24.5706 3.00146 28.8606 4.80147 32.0406 8.00146H26.2306C25.6806 8.00146 25.2306 8.45146 25.2306 9.00146C25.2306 9.55147 25.6806 10.0015 26.2306 10.0015H33.7306C34.5606 10.0015 35.2306 9.33146 35.2306 8.50146V1.00146C35.2306 0.451465 34.7806 0.00146484 34.2306 0.00146484C33.6806 0.00146484 33.2306 0.451465 33.2306 1.00146V6.38146C29.7106 2.94146 25.0106 1.00146 20.0006 1.00146C9.52061 1.00146 1.00061 9.52147 1.00061 20.0015C1.00061 20.5515 1.45061 21.0015 2.00061 21.0015C2.55061 21.0015 3.00061 20.5515 3.00061 20.0015Z" fill="#00112C"/>
                  <path d="M38.0006 19.0015C37.4506 19.0015 37.0006 19.4515 37.0006 20.0015C37.0006 20.6415 36.9606 21.2915 36.8906 21.9415C36.0306 29.7215 29.7606 36.0115 21.9806 36.8915C16.7506 37.4815 11.6506 35.6615 7.99063 32.0015H13.7706C14.3206 32.0015 14.7706 31.5515 14.7706 31.0015C14.7706 30.4515 14.3206 30.0015 13.7706 30.0015H6.27063C5.44063 30.0015 4.77063 30.6715 4.77063 31.5015V39.0015C4.77063 39.5515 5.22063 40.0015 5.77063 40.0015C6.32063 40.0015 6.77063 39.5515 6.77063 39.0015V33.6215C10.3306 37.0715 15.0606 39.0015 20.0206 39.0015C20.7406 39.0015 21.4706 38.9615 22.2006 38.8815C30.9006 37.9015 37.9206 30.8615 38.8806 22.1615C38.9606 21.4415 39.0006 20.7115 39.0006 20.0015C39.0006 19.4515 38.5506 19.0015 38.0006 19.0015Z" fill="#00112C"/>
                </g>
                <defs>
                  <clipPath id="clip0_3659_123">
                    <rect width="40" height="40" fill="white" transform="translate(0.000610352 0.00146484)"/>
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
          <div class="shipping-method-container" v-for="(meth, index) in this.shippingMethods" :key="index">
            <input type="radio" :id="'smethod-' + index" name="smethod" @change="onCheckBoxChange($event)">
            <label for="smethod"> {{meth.carrier_title}} - {{meth.method_title}}: + {{meth.amount.value}} {{meth.amount.currency}} </label><br>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="payment-container">
          <div class="container-wrapper" v-for="(pm, index) in this.paymentMethods":key="index">
            <div class="pm-header" v-if="pm.type!='scheme'">
              <input
                type="radio"
                class="pm-radio"
                :id="`radio-${index}`"
                name="radiopm"
                :value="pm.type"
                @change="onSelectPaymentMethod($event)"
                v-model="selectedpm"
              >
              <img
                v-if="pm.icon"
                :src="pm.icon.url"
              >
              <label
                v-if="paymentMethodsResponse.paymentMethods[index]"
                class="pm-label"
                for="radiopm"
              >
                Pay with  {{paymentMethodsResponse.paymentMethods.filter(m => m.type == pm.type ).length > 0 ? paymentMethodsResponse.paymentMethods.filter(m => m.type == pm.type )[0].name : pm.type}}
              </label>
            </div>
            <div class="component" v-if="pm.type!='scheme'" :id="`${pm.type}-container`" v-show="selectedpm === `${pm.type}`"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let AdyenCheckout;
import '@adyen/adyen-web/dist/adyen.css';

if (process.client) {
  AdyenCheckout = require("@adyen/adyen-web");
}

export default {
  components: {},
  props: {

  },
  data() {
    return {
      url: "",
      bearer: "",
      clientKey: "test_Y6ET72GBOBFGXFVJCPAHJTQU4MVGZDSR",
      cartId: '',
      redirectResult: '',
      checkout: '',
      selectedpm: '',
      paymentMethods: [],
      shippingMethods: [],
      adyenStatusResponse: '',
      paymentMethodsResponse: '',
      orderId:'',
      stateData:'',
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
      title: "Payment page",
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

    this.storage()
  },

  methods: {
    storage() {
      this.url = localStorage.getItem('url');
      this.bearer = localStorage.getItem('bearer');
      this.cartId = localStorage.getItem('cart');

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
    onSelectPaymentMethod(event) {
      let method = event.target;
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
    async setFormShippingAddress() {
      this.shopperShippingAddress.street =  document.getElementById('fstreet').value;
      this.shopperShippingAddress.postcode = document.getElementById('fpostcode').value;
      this.shopperShippingAddress.city = document.getElementById('fcity').value;
      this.shopperShippingAddress.region = document.getElementById('fregion').value;
      this.shopperShippingAddress.country_code = document.getElementById('fcountry').value;
      let sameBilling = document.getElementById('samebilling').checked;

      let response = await this.setShippingAdress();

      if(response.data.setShippingAddressesOnCart.cart){
        if(sameBilling) {
          this.shopperBillingAddress.street =  this.shopperShippingAddress.street;
          this.shopperBillingAddress.postcode = this.shopperShippingAddress.postcode;
          this.shopperBillingAddress.city = this.shopperShippingAddress.city;
          this.shopperBillingAddress.region = this.shopperShippingAddress.region;
          this.shopperBillingAddress.country_code = this.shopperShippingAddress.country_code;

          let response = await this.setBillingAddress();

          if(response.data.setBillingAddressOnCart.cart) {
            //document.getElementsByClassName("form-billing-data")[0].classList.add("collapsed");
            localStorage.setItem("billing", JSON.stringify(this.shopperBillingAddress));
          }
          //document.getElementsByClassName("form-shipping-data")[0].classList.add("collapsed");
        }
        else {
          document.getElementsByClassName("form-billing-data")[0].classList.remove("collapsed");
        }
        localStorage.setItem("shipping", JSON.stringify(this.shopperShippingAddress));
      }
    },

    // Save ShippingAddress form locally and set it on cart
    async setFormBillingAddress() {
      this.shopperBillingAddress.street =  document.getElementById('fbstreet').value;
      this.shopperBillingAddress.postcode = document.getElementById('fbpostcode').value;
      this.shopperBillingAddress.city = document.getElementById('fbcity').value;
      this.shopperBillingAddress.region = document.getElementById('fbregion').value;
      this.shopperBillingAddress.country_code = document.getElementById('fbcountry').value;

      let response = await this.setBillingAddress();

      if(response.data.setBillingAddressOnCart.cart){
        document.getElementsByClassName("form-billing-data")[0].classList.add("collapsed");
        localStorage.setItem("billing", JSON.stringify(this.shopperBillingAddress));
      }
    },

    // Create checkout config and mount checkout components
    async createConfig() {

      let configuration = {
        environment: 'test',
        clientKey: this.clientKey,
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
      console.log(this.paymentMethods);
      console.log(this.paymentMethodsResponse.paymentMethods);
      let configs = this.paymentMethods.map(pm => {
        if (pm.configuration) {
          if(pm.type == 'scheme'){ pm.type = 'card'; }
          configuration['paymentMethodsConfiguration'][pm.type] = pm.configuration;
          configuration['paymentMethodsConfiguration'][pm.type]['showPayButton'] = true;
        }
      })
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
          localStorage.removeItem('cart');
          localStorage.removeItem('cartItems');
          localStorage.removeItem('shipping');
          localStorage.removeItem('billing');
          localStorage.removeItem('shipMethods');

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

    // Query logic to place an order for an adyen payment
    async placeOrder(state, component) {
      try {
        const cartId = this.cartId;
        const stateData = JSON.stringify(state.data);
        let data = "";

        if (state.data.paymentMethod.type === "scheme") {
          data = JSON.stringify({
            query: `mutation setPaymentMethod($cartId: String! $stateData: String!) { setPaymentMethodOnCart( input: { cart_id: $cartId payment_method: { code:`
              + '"' + "adyen_cc" + '"'
              + `, adyen_additional_data_cc: { cc_type:`
              + '"' + state.data.paymentMethod.brand + '"'
              + `, stateData: $stateData}}}) {cart { selected_payment_method { code title } }} placeOrder( input: { cart_id: $cartId }) { order { order_id adyen_payment_status { isFinal resultCode additionalData action}}}}`,
            variables: {cartId: cartId, stateData: stateData },
          });
        } else {
          let brand = state.data.paymentMethod.type;
          data = JSON.stringify({
            query: `mutation setPaymentMethod($cartId: String! $stateData: String!) { setPaymentMethodOnCart( input: { cart_id: $cartId payment_method: { code:`
              + '"' + "adyen_hpp" + '"'
              + `, adyen_additional_data_hpp: { brand_code:`
              + '"' + brand + '"'
              + `, stateData: $stateData}}}) {cart { selected_payment_method { code title } }} placeOrder( input: { cart_id: $cartId }) { order { order_id adyen_payment_status { isFinal resultCode additionalData action}}}}`,
            variables: {cartId: cartId, stateData: stateData },
          });
        }

        const response = await this.sendGraphQLReq(data);
        this.orderId = response.data.placeOrder.order.order_id;
        let paymentStatus = response.data.placeOrder.order.adyen_payment_status;

        if (!paymentStatus.isFinal) {
          let pmtype = state.data.paymentMethod.type === "scheme" ? "card" : state.data.paymentMethod.type;
          this.checkout.createFromAction(JSON.parse(paymentStatus.action)).mount('#' + pmtype  + '-container');
        } else {
          alert(paymentStatus.resultCode);
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
        let orderId = this.orderId;

        let payload = state.data;
        payload.orderId = orderId;
        payload = JSON.stringify(payload);

        const data = JSON.stringify({
          query: `mutation getAdyenPaymentDetails($payload: String!, $cartId: String!) {adyenPaymentDetails(payload: $payload, cart_id: $cartId) {isFinal resultCode additionalData action}}`,
          variables: {cartId: cartId, payload: payload },
        });

        const response = await this.sendGraphQLReq(data);

        alert(response.data.adyenPaymentDetails.resultCode);
        this.processResult(response.data.adyenPaymentDetails);
        // { "adyenPaymentDetails": { "isFinal": true, "resultCode": "Authorised", "additionalData": null, "action": null } }

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

        const data = JSON.stringify({
          query: `query getAdyenPaymentStatus($orderNumber: String!, $cartId: String!) { adyenPaymentStatus(orderNumber: $orderNumber, cartId: $cartId) { isFinal resultCode additionalData action}}`,
          variables: {cartId: cartId, orderNumber: orderId },
        });

        const response = await this.sendGraphQLReq(data);
        this.adyenStatusResponse = response.data.adyenPaymentStatus.resultCode;
        return response;

      } catch (error) {
        this.handlePaymentError(error);
      }
    },

    // Query logic to set guest email on Cart
    async addGuestToCart(shopperEmail) {
      try {
        const cartId = this.cartId;

        const data = JSON.stringify({
          query:  'mutation{setGuestEmailOnCart( input: { cart_id: '
            + '"' + cartId + '"'
            + ' email: '+ '"' + shopperEmail
            + '"' + ' }) {cart { email }}}',
        });

        const response = await this.sendGraphQLReq(data);

        return response;

      } catch (error) {
        console.error(error);
        alert("Error occurred. Look at console for details");
      }
    },

    // Query logic to set shipping address on Cart
    async setShippingAdress() {
      try {
        const cartId = this.cartId;

        const data = JSON.stringify({
          query: `mutation{setShippingAddressesOnCart(input: {cart_id:` + '"'
            + cartId + '"'
            + `, shipping_addresses: [{address: {firstname:`
            + '"' + this.shopperShippingAddress.firstName + '"'
            + `, lastname:` + '"'
            + this.shopperShippingAddress.lastName + '"'
            + `, company:`
            + '"' + "Magento"
            + '"'
            + `, street:[`
            + '"' + this.shopperShippingAddress.street + '"'
            + `], city:`
            + '"' + this.shopperShippingAddress.city + '"'
            + `, region:`
            + '"' + this.shopperShippingAddress.region + '"'
            + `, postcode:`
            + '"' + this.shopperShippingAddress.postcode + '"'
            + `, country_code:`
            + '"' + this.shopperShippingAddress.country_code + '"'
            + `, telephone:`
            + '"' + this.shopperShippingAddress.phone + '"'
            + `, save_in_address_book: false}}]}) {cart {shipping_addresses {firstname lastname company street city region {code label} postcode telephone available_shipping_methods { available amount {value currency } carrier_code carrier_title error_message method_code method_title } country { code label }}}}}`,
        });

        const response = await this.sendGraphQLReq(data);
        this.shippingMethods = response.data.setShippingAddressesOnCart.cart.shipping_addresses[0].available_shipping_methods;
        localStorage.setItem("shipMethods", JSON.stringify(this.shippingMethods));

        return response;

      } catch (error) {
        console.error(error);
        alert("Error occurred. Look at console for details");
      }
    },

    // Query logic to set billing address on Cart
    async setBillingAddress() {
      try {
        const cartId = this.cartId;

        const data = JSON.stringify({
          query: 'mutation{setBillingAddressOnCart(input: {cart_id:'
            + '"' + cartId + '"' +
            ', billing_address: {address: {firstname: '
            + '"' + this.shopperBillingAddress.firstName + '"'
            + ', lastname: '
            + '"' + this.shopperBillingAddress.lastName + '"'
            + ', company: "Magento" , street: ['
            + '"' + this.shopperBillingAddress.street + '"'
            + '], city:'
            + '"' + this.shopperBillingAddress.city + '"'
            + ', region:'
            + '"' + this.shopperBillingAddress.region + '"'
            + ', postcode:'
            + '"' + this.shopperBillingAddress.postcode + '"'
            + ', country_code:'
            + '"' + this.shopperBillingAddress.country_code + '"'
            + ', telephone:'
            + '"' + this.shopperBillingAddress.phone + '"'
            + ', save_in_address_book: false }, same_as_shipping: true }}) {cart {billing_address {firstname lastname company street city region { code label} postcode telephone country { code label }}} }}',
        });

        const response = await this.sendGraphQLReq(data);
        return response;

      } catch (error) {
        console.error(error);
        alert("Error occurred. Look at console for details");
      }
    },

    // Query logic to set shipping method on Cart
    async setShippingMethod(method) {
      try {
        const cartId = this.cartId;

        //set shippingmethod
        const data = JSON.stringify({
          query: `mutation {setShippingMethodsOnCart( input: { cart_id: `
            + `"` + cartId + `"`
            + `, shipping_methods: [{carrier_code: `
            + `"` + method.carrier_code + `"`
            + `, method_code:  `
            + `"` + method.method_code + `"`
            + `}]}) {cart { shipping_addresses { selected_shipping_method { carrier_code carrier_title method_code method_title amount { value currency }}}}}}`,
        });

        const response = await this.sendGraphQLReq(data);
        return response;

      } catch (error) {
        console.error(error);
        alert("Error occurred. Look at console for details");
      }
    },

    // Query logic to get available payment methods based on cart
    async getPaymentMethods() {
      try {
        const cartId = this.cartId;

        const data = JSON.stringify({
          query: `query getAdyenPaymentMethods($cartId: String!) {adyenPaymentMethods(cart_id: $cartId) {paymentMethodsExtraDetails {type icon { url width height} isOpenInvoice configuration {amount {value currency} currency}} paymentMethodsResponse { paymentMethods { name type brand brands issuers {id name} configuration { merchantId merchantName} details { key type items { id name } optional }}}}}`,
          variables: {cartId: cartId},
        });

        const response = await this.sendGraphQLReq(data);
        this.paymentMethods = response.data.adyenPaymentMethods.paymentMethodsExtraDetails;
        this.paymentMethodsResponse = response.data.adyenPaymentMethods.paymentMethodsResponse;
        console.log(this.paymentMethodsResponse.paymentMethods[0].name);

        await this.createConfig();
        return response;

      } catch (error) {
        console.error(error);
        alert("Error occurred. Look at console for details");
      }
    },

    // Function to send any query to graphql endpoint of the host
    async sendGraphQLReq(data) {
      try {
        const host = this.url;
        const bearer = this.bearer;
        var response;
        response = await fetch(host +'/graphql', {
          method: 'POST',
          mode: 'cors',
          headers: {
            "Content-Type": "application/json",
            'Content-Length': data.length,
            Authorization: 'Bearer '+ bearer,
            'Origin': 'https://8080-adyenexampl-adyenvueonl-wumtblawveo.ws-eu96.gitpod.io',
          },
          body: data,
        })
          .then((res) => res.json())
          //.then((result) => console.log( result))
          .then(result => response = result)
        return response;

      } catch (error) {
        console.error(error);
        alert("Error occurred. Look at console for details");
      }
    },

  },
};
</script>
