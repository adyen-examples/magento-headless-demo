<template>
  <div>
    <div id="payment-page">
      <div class="forms">
        <div class="form-shopper-data">
          <h2> Your Details </h2>
          <form>
            <label for="fname">First name:</label>
            <label for="lname">Last name:</label><br>
            <input type="text" id="fname" name="fname">
            <input type="text" id="lname" name="lname"><br>
            <label for="femail">Email:</label>
            <label for="fphone">Phone:</label><br>
            <input type="text" id="femail" name="femail">
            <input type="text" id="fphone" name="fphone"><br>
            <button type='button' @click="setFormShopperData()">submit</button>
          </form>
        </div>
        <div class="form-shipping-data collapsed">
          <h2> Shipping Address </h2>
          <form>
            <label for="fstreet">Street:</label>
            <label for="fpostcode">Postcode</label><br>
            <input type="text" id="fstreet" name="fstreet">
            <input type="text" id="fpostcode" name="fpostcode"><br>
            <label for="fcity">City:</label>
            <label for="fregion">Region</label><br>
            <input type="text" id="fcity" name="fcity">
            <input type="text" id="fregion" name="fregion"><br>
            <label for="fcountry">Country</label>
            <label for="samebilling" id="samebilling-label">Same as Billing</label>
            <input type="checkbox" id="samebilling" name="samebilling"><br>
            <input type="text" id="fcountry" name="fcountry"><br>
            <button type='button' @click="setFormShippingAddress()">submit</button>
          </form>
        </div>
        <div class="form-billing-data collapsed">
          <h2> Billing Address </h2>
          <form>
            <label for="fbstreet">Street:</label>
            <label for="fbpostcode">Postcode</label><br>
            <input type="text" id="fbstreet" name="fstreet">
            <input type="text" id="fbpostcode" name="fpostcode"><br>
            <label for="fbcity">City:</label>
            <label for="fbregion">Region</label><br>
            <input type="text" id="fbcity" name="fbcity">
            <input type="text" id="fbregion" name="fbregion"><br>
            <label for="fbcountry">Country</label>
            <input type="text" id="fbcountry" name="fbcountry"><br>
            <button type='button' @click="setFormBillingAddress()">submit</button>
          </form>
        </div>
        <div class="shipping-method-selector">
          <h2> Shipping Method Address </h2>
          <div class="shipping-method-container" v-for="(meth, index) in this.shippingMethods" :key="index">
            <input type="radio" :id="'smethod-' + index" name="smethod" @change="onCheckBoxChange($event)">
            <label for="smethod"> {{meth.carrier_title}} - {{meth.method_title}}: + {{meth.amount.value}} {{meth.amount.currency}} </label><br>
          </div>
        </div>
      </div>
      <div class="btnarea">
        <button class="graphbtn" @click="placeOrder('ideal')">Place Order ideal</button>
        <button class="graphbtn" @click="adyenStatus()">Status</button>
        <button class="graphbtn" @click="adyenDetails()">Details</button>
      </div>
      <table>
        <tr>
          <td>Satetedata</td>
          <td>{{stateData}}</td>
        </tr>
        <tr v-if="placeOrderResponse != ''">
          <td class="statitle">Place Order Resp</td>
          <td class="statval">{{orderId}} {{placeOrderResponse.adyen_payment_status.resultCode}}</td>
        </tr>
        <tr v-if="adyenDetailsResponse != ''">
          <td class="statitle">Details Response</td>
          <td class="statval">{{adyenDetailsResponse}}</td>
        </tr>
        <tr v-if="adyenStatusResponse != ''">
          <td class="statitle">Status Response</td>
          <td class="statval">{{adyenStatusResponse}}</td>
        </tr>
      </table>

      <div id="dropin-container"></div>
      <div class="container">
        <div class="payment-container">
          <div class="payment" :ref="`${type}`"></div>
          <div id="card-container" class="component"></div>
          <div id="alipay-container" class="component"></div>
          <div id="paypal-container" class="component"></div>
        </div>
      </div>
      <button class="main-button" @click="placeOrder('cc')">Place Order CC</button>
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
      sessionId: '',
      redirectResult: '',
      clientKey: '',
      url: "https://8080-adyenexampl-adyenmagent-7j25ev8o4sr.ws-eu97.gitpod.io",
      bearer: "mbvjlftxgpunwaiqi0tfsn2dhkhxpips",
      cartId: '',
      cartItems: [],
      defaultItem : { quantity: 3, sku: "24-MB04"},
      shippingAddress: '',
      billingAddress: '',
      shippingMethod: '',
      paymentMethods: [],
      shippingMethods: [],
      placeOrderResponse: '',
      adyenDetailsResponse: '',
      adyenStatusResponse: '',
      orderId:'',
      stateData:'',
      guestEmail: '',
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
      localStorage.setItem('url', 'https://8080-adyenexampl-adyenmagent-7j25ev8o4sr.ws-eu97.gitpod.io');
      localStorage.setItem('bearer', "mbvjlftxgpunwaiqi0tfsn2dhkhxpips");
      this.cartId = localStorage.getItem('cart');
    },

    async onCheckBoxChange(event) {
      let method = this.shippingMethods[event.target.id.substring(event.target.id.indexOf('-') + 1)];
      let response = await this.setShippingMethod(method);

      console.log(response);

      await this.getPaymentMethods();

    },

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
        document.getElementsByClassName("form-shopper-data")[0].classList.add("collapsed");
        document.getElementsByClassName("form-shipping-data")[0].classList.remove("collapsed");
      }

    },

    async setFormShippingAddress() {
      this.shopperShippingAddress.street =  document.getElementById('fstreet').value;
      this.shopperShippingAddress.postcode = document.getElementById('fpostcode').value;
      this.shopperShippingAddress.city = document.getElementById('fcity').value;
      this.shopperShippingAddress.region = document.getElementById('fregion').value;
      this.shopperShippingAddress.country_code = document.getElementById('fcountry').value;

      let response = await this.setShippingAdress();

      if(response.data.setShippingAddressesOnCart.cart){
        document.getElementsByClassName("form-shipping-data")[0].classList.add("collapsed");
        if(document.getElementById('samebilling').checked) {
          this.shopperBillingAddress.street =  document.getElementById('fstreet').value;
          this.shopperBillingAddress.postcode = document.getElementById('fpostcode').value;
          this.shopperBillingAddress.city = document.getElementById('fcity').value;
          this.shopperBillingAddress.region = document.getElementById('fregion').value;
          this.shopperBillingAddress.country_code = document.getElementById('fcountry').value;

          let response = await this.setBillingAddress();

          if(response.data.setBillingAddressOnCart.cart) {
            document.getElementsByClassName("form-billing-data")[0].classList.add("collapsed");
          }
        }
        else {
          document.getElementsByClassName("form-billing-data")[0].classList.remove("collapsed");
        }
      }
    },

    async setFormBillingAddress() {
      this.shopperBillingAddress.street =  document.getElementById('fbstreet').value;
      this.shopperBillingAddress.postcode = document.getElementById('fbpostcode').value;
      this.shopperBillingAddress.city = document.getElementById('fbcity').value;
      this.shopperBillingAddress.region = document.getElementById('fbregion').value;
      this.shopperBillingAddress.country_code = document.getElementById('fbcountry').value;

      let response = await this.setBillingAddress();

      if(response.data.setBillingAddressOnCart.cart){
        document.getElementsByClassName("form-billing-data")[0].classList.add("collapsed");
      }
    },

    async sendGraphQLReq(host, bearer, data) {
      try {
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

    async addGuestToCart(shopperEmail) {
      try {
        const host = this.url;
        const bearer = this.bearer;
        const cartId = this.cartId;

        const data = JSON.stringify({
          query:  'mutation{setGuestEmailOnCart( input: { cart_id: '
            + '"' + cartId + '"'
            + ' email: '+ '"' + shopperEmail
            + '"' + ' }) {cart { email }}}',
        });

        const response = await this.sendGraphQLReq(host, bearer, data);
        this.guestEmail = response.data.setGuestEmailOnCart.cart.email;

        return response;

      } catch (error) {
        console.error(error);
        alert("Error occurred. Look at console for details");
      }
    },

    async setShippingAdress() {
      try {
        const host = this.url;
        const bearer = this.bearer;
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

        const response = await this.sendGraphQLReq(host, bearer, data);
        this.shippingAddress = response.data.setShippingAddressesOnCart.cart.shipping_addresses[0];
        this.shippingMethods = response.data.setShippingAddressesOnCart.cart.shipping_addresses[0].available_shipping_methods;
        console.log(this.shippingMethods);
        return response;

      } catch (error) {
        console.error(error);
        alert("Error occurred. Look at console for details");
      }
    },

    async setBillingAddress() {
      try {
        const host = this.url;
        const bearer = this.bearer;
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

        // query: `mutation{setBillingAddressOnCart(input: {cart_id:` + `"` + cartId + `"` + `, billing_address: {address: {firstname: "Bob" lastname: "Roll" company: "Magento" street: ["Magento Pkwy", "Main Street"] city: "New York" region: "TX" postcode: "78753" country_code: "US" telephone: "8675309" save_in_address_book: false} same_as_shipping:true,}}) {cart {billing_address {firstname lastname company street city region { code label} postcode telephone country { code label }}} }}`,

        const response = await this.sendGraphQLReq(host, bearer, data);
        this.billingAddress = response.data.setBillingAddressOnCart.cart.billing_address;
        return response;

      } catch (error) {
        console.error(error);
        alert("Error occurred. Look at console for details");
      }
    },

    async setShippingMethod(method) {
      try {
        const host = this.url;
        const bearer = this.bearer;
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

        const response = await this.sendGraphQLReq(host, bearer, data);
        this.shippingMethod = response.data.setShippingMethodsOnCart.cart.shipping_addresses[0].selected_shipping_method;
        return response;

      } catch (error) {
        console.error(error);
        alert("Error occurred. Look at console for details");
      }
    },

    async getPaymentMethods() {
      try {
        const host = this.url;
        const bearer = this.bearer;
        const cartId = this.cartId;

        //get PMs
        const data = JSON.stringify({
          query: `query getAdyenPaymentMethods($cartId: String!) {adyenPaymentMethods(cart_id: $cartId) {paymentMethodsExtraDetails {type icon { url width height}isOpenInvoice configuration {amount {value currency} currency}} paymentMethodsResponse { paymentMethods { name type brand brands configuration { merchantId merchantName} details { key type items { id name } optional }}}}}`,
          variables: {cartId: cartId},
        });

        const response = await this.sendGraphQLReq(host, bearer, data);
        this.paymentMethods = response.data.adyenPaymentMethods.paymentMethodsExtraDetails;

        await this.createConfig();
        return response;

      } catch (error) {
        console.error(error);
        alert("Error occurred. Look at console for details");
      }
    },

    async createConfig() {

      const configuration = {
        environment: 'test', //
        clientKey: 'test_Y6ET72GBOBFGXFVJCPAHJTQU4MVGZDSR',
        countryCode: "NL", // Only needed for test. When live, this is retrieved automatically.
        amount: {
          currency: "EUR",
          value: 1000
        },
        onPaymentCompleted: (result, component) => {
          console.info(result, component);
        },
        onChange: this.handleOnChange,
        onError: (error, component) => {
          console.error(error.name, error.message, error.stack, component);
        },
        paymentMethodsConfiguration: {
          card: {
            hasHolderName: true,
            holderNameRequired: true,
          },
        }
      };

      let configs = this.paymentMethods.map(pm => pm.configuration ? configuration['paymentMethodsConfiguration'][JSON.stringify(pm.type)] = pm.configuration : null)

      console.log(configs);
      console.log(configuration);

      const checkout = await AdyenCheckout(configuration);
      console.log(checkout);
      const dropinComponent = checkout.create('dropin').mount('#dropin-container');

      const cardComponent = checkout.create('card', configuration).mount('#card-container');
      const paypalComponent = checkout.create('paypal', configuration).mount('#paypal-container');
      //const alipayComponent = checkout.create('alipay', configuration).mount('#alipay-container');

    },

    handleOnChange(state, component) {
      console.log(state)
      this.stateData = state.data;
    },

    async placeOrder(method) {
      try {
        const host = this.url;
        const bearer = this.bearer;
        const cartId = this.cartId;
        var data = "";
        if(method == 'cc') {
          const stateData = JSON.stringify(this.stateData);
          //place order
          data = JSON.stringify({
            query: `mutation setPaymentMethod($cartId: String! $stateData: String!) { setPaymentMethodOnCart( input: { cart_id: $cartId payment_method: { code:` + '"' + "adyen_cc" + '"' + `, adyen_additional_data_cc: { cc_type:` + '"' + "VI" + '"' + `, stateData: $stateData}}}) {cart { selected_payment_method { code title } }} placeOrder( input: { cart_id: $cartId }) { order { order_id adyen_payment_status { isFinal resultCode additionalData action}}}}`,
            variables: {cartId: cartId, stateData: stateData },
          });
        }

        if (method == 'ideal') {
          const stateData = "{\"riskData\":{\"clientData\":\"eyJ2ZXJzaW9uIjoiMS4wLjAiLCJkZXZpY2VGaW5nZXJwcmludCI6IkRwcXdVNHpFZE4wMDUwMDAwMDAwMDAwMDAwS1piSVFqNmt6czAwNTU4MjEzMzZjVkI5NGlLekJHeWRJdFhHVURNbUJpeDdSWDNhejgwMDJEU0tnWWczclJMMDAwMDBUSXZqWDFCWHc0blhrQVpBdzljY0RVdzlTYkQ4NGg6NDAiLCJwZXJzaXN0ZW50Q29va2llIjpbIl9ycF91aWQ9MWNhMjYzNjItNWQxYy0yNGZhLTAzMDEtYjQ5YmVkYjI0YWEyIl19\"},\"paymentMethod\":{\"type\":\"ideal\",\"issuer\":\"1154\",\"checkoutAttemptId\":\"b3ffe3e5-80bf-41fa-bece-7a2668de48be1682793487582AADEBA7D0C15A7C6BDAF1295CE7EA7D0B57E7041BADF239021DD50FF61156824\"},\"clientStateDataIndicator\":true}";
          data = JSON.stringify({
            query: `mutation setPaymentMethod($cartId: String! $stateData: String!) { setPaymentMethodOnCart( input: { cart_id: $cartId payment_method: { code:` + '"' + "adyen_hpp" + '"' + `, adyen_additional_data_hpp: { brand_code:` + '"' + "ideal" + '"' + `, stateData: $stateData}}}) {cart { selected_payment_method { code title } }} placeOrder( input: { cart_id: $cartId }) { order { order_id adyen_payment_status { isFinal resultCode additionalData action}}}}`,
            variables: {cartId: cartId, stateData: stateData },
          });
        }
        const response = await this.sendGraphQLReq(host, bearer, data);
        this.placeOrderResponse = response.data.placeOrder.order;
        this.orderId = response.data.placeOrder.order.order_id;
        return response;

      } catch (error) {
        console.error(error);
        alert("Error occurred. Look at console for details");
      }
    },

    async adyenDetails(method) {
      try {
        const host = this.url;
        const bearer = this.bearer;
        const cartId = this.cartId;
        const orderId = this.orderId;

        const payload = "{\"details\":{\"threeDSResult\":\"eyJ0cmFuc1N0YXR1cyI6IlkiLCJhdXRob3Jpc2F0aW9uVG9rZW4iOiJBYjAyYjRjMCFCUUFCQWdCdnZEWlg0M0xIbkliZWxYZk9vTmdIQkgrdDV2YS9yWmRmUjljVC85RXN3blNHUkh0d1k5OERjYmZKc0FpYTBsdUVMOFdPMy81Y2tZSGpudUVkYlpFTGZKNFN1MVJFUkhWL0FCd2hwMVo0eWdRandGMnpNQXUwNXpmRmRwcklLOWVPWG1lWnQrYXVkZW5MbmViVU4rMlVTaXltMXh0aFFrUGY2Z0gzcmdCTm1DMVJPQTdldXE1T1BRNzQ4alVrWXVSSVpzL0lGRkptcU5nek8yaVpGMG50dFNRNUZWQm4yanR2TEJYNWo2cW4rc0xJS2RFY0oxcW5WRmE2Rm11bGZZV3BkM3VwOUNjNGtVQkcwYlQ5SHVZL3dGUGp4QTMwUXV5R0REMVNhNXI4V2tpazk5bkpGMjF0VWdpMXI4YlkvUFl2NllxSkxyWUQyYVplMFlYTE9VUElJUzhEREZzVk9veGRsSE5IdkZRaHlqb0tPV1ZLcWJKak5GL2pScnd5NzFCS1M1NFdpVjZBNmdNT0szVktFNEZEYjZ2R2pYVFBpUnZqSVRQUGhHU013S2NvWE1janlEanBnSXpWOWQwdmp2MElUVGV4VGlnUUFQM21pUkJYQ2JzQU1oYlQ5RUNScE11MmptUTZ6dU1qS0c3djlhZXhXbTB1ZnBpN0V3RWtLUUhVSHRaSkQwU2svdUhuVGtQT1lVcTBDN3F4T21uZXBOYlJXbkh2VUZIcGlBdENpd0h1L09oaGp1cEJuekdmVDgrbHRqMDE1NkEwZDlkLzRqMDU5TnBOeWcvK3g0OVBjb0lsanFsZENPSUFFaDNGams0MTZta1dXSmx6QXArVTlVRWNVMVcyM095bkgrenVpWC9ZcDYwS1EzaUhVc3BZT25NSGJqeE5waU9TaXd6UHROUlFqcGFZaEp4dmtVa0FTbnNpYTJWNUlqb2lRVVl3UVVGQk1UQXpRMEUxTXpkRlFVVkVPRGRETWpSRVJEVXpPVEE1UWpnd1FUYzRRVGt5TTBVek9ESXpSRFk0UkVGRFF6azBRamxHUmpnek1EVkVReUo5aVNlUzUxVVJ5Z1J1MlNJKzlNelJRdVJEOTFybXY5SnorVk82d3lKMDB0YXZYdzY0RW9UZEZ3cEl0cVpkczdWOEttbi9Bcisya0VQdHlFOUhwbzZmdUM1dGNmTTg3L1R1dmlJSTEwWlpjV1d1a1FYQjRHSWZUZ2tCL29ybmZFem1iWmNxTmZUQVJlL2RPQWtyTjAwYkg2Z2NKcFMrdzdEakUwVklUOFRWOWJIL2o0ZSsrbjcxUVQ0UzlxdmR0Z2FIM2ExcjYveVMwZXVub2oyL1NmWmRnZXJhRUFKbEFJWXdpNzhReHFZQWE5dTQxcko2akxqZllhZHpmT2QrYXpZMGxvUHFOQ0hZc3Mydk5lamRFYmNwVy95YlVvTEFtMCsvb0tnZ2JDR1VSV2krb3dXL29JdUFnamE0TEszc2NZWnRmZkNqTzFybWZFZlpVVllSUllZV0NvSHo4WTdvbFErRVQzdWJDN0RDa1dkL21CZDIzam12NmV0cWwrVzJvSlR6bGRDdmVRVWNOeldsMTVvQ2tSV1QxclhXa1lpRUVxWVZIUGNXekhxQVd0VHBvK3BLbWFXQmdNcGlKMnlmMERzVHZ0RHQ4YU5ralI0NGRuaVZ2dlJLRmE1NzVmRlRlai9DeTdhZ3BhYmV4bXBTOTF3ZEErQ1MyOUpwejFzWGxkdDl2NWMxcEE1S3U1Wk5xcHRhblB1VllueENqa0ZEOFBOUzBLVjBSS3A1RG8xYmJ2b1I4RVBCZUVuVUd4QjBQWXdKMU0vb2hWN29kbjBDZFVSWVdNZGIzQ1hJbzZvWVNwR2xxNW5scFFGQVRmRzJyMjE1N3J1QlZML1JZUUdrQXZuQ0pkZ3NIY1JReFZmck04aXJ1ajdqQW5mTkVpQnVEemRobXVkQkZYTVhzOHRhTFRaTEtRcjllVHlkaERrRUFGWUUzaXVHelF3MjJoWFNTMU5VcWZEVjlIM1NGRlhrandYbSswNTZTUGFPb1V5SUo4TkxvTkdNNmxoMi9JMHZsTENkWjlLTGdKRUJ4T1ZZQlB4N0FvbE82d3BDZFRRRXV4dWhHR0Y0UFZEcXBpOFJ0bzllVTVjMFlQamxGQWVVQnJ4VDVWTERrcUoxNE5sK1pXaHN6YlM5TUQzTk1zVWhsNVF4R3BhZEZkSi9XSE0vb3JTS1NzM0RMeGFsc1hvcU5aNklxV1FlUmI5WnJvbktnMmtlU05oT0cxdlVMMTBuWHJDRnlvWkJkS0w1MUYyNFF6VDRvSDE0VjRPYklkc0dMTkcxYzF3WmZqWHBjQVZ1TFBPWFlSdG55cCtLRXFSTUhFMnc1S255Y2hqTE11ZWlyaGUxMWU5KzV0KzBVLzBLclJXMjF5a2JKdjZyY0FiL2ZNcTdRaktET1pEY0F5VVFNbHp3YnFFaDFXeGJPYjJVUmNHRHhDR0VjbXFybG5DRW9GYUMxSXNoQUQrRUJGd2dEMDJQdGZFdGowS2hvc05vdWpkcVRNblNKSCtNNWcyZ0wzSEdjVHlKWjYrYnZGY1ZvL240eG9SL1U5MTZwUTlNZ2o4bGdDKytmVEVjSlpEdDdRdmtYY0ppcUd1V0ZJUWllb2k0c3VTY2lDWEJJTU9INEJCRXNzSjNjZ1ArNGxucmozTVhEVzg3Ti9MMkdERDFLZG4yVEFLS1RwZno0c21iLytkaUZ4TUhEMjhkVzl0dHJ4SnY4WFJNUXdmQWNiV2N0QlJQVVJncXJZR1EzaERmampkd0NNcmU1Qjk3QVYvOE15eVA1Wi9ZYnhMTHRBVEhCMzNLa3Y1WlJKcXZzVHdkWHNSTk80Z3A1QnJDSmVHVlFMRXNYWDc0TzdYWjlsRnFMd2NxTmFJcUxPbHRmSTFuaStON21iZG1KNHRMNWlJNVY4MXFlYVhJdk83VTZHMGVPZktnZVNlQnRpRDJjUVZyOEZGU2FPcVJCUU1DUElzb0VubnpnZ0VLVXdqbHNuRnlyNi9QOUJ2d0FoTGRseVVkbkYybFpBaUZyNDhKUjhXTEtrTkg3YUx0U3VQOTIycDBYS2Mwa2FCS2U3TTZrc215eDd3ZGxPTnNjaXpGUGdXSjkwMHI2YzhyYmJ5SWw4aHBYajBrV3ZWWmtZWUVxaTZVYVNJdXdZR2Z6U3BWT25sU0ViKzd0cXhtQVhNMFFUUUh1VVlyZTkwZjZRRWVWWXpLZFBPQWJUTWk0eFBmYmpJQkZPSDkyTXFrVTlYc0k0TXNSNTl3dmJZUnZtcTc1cS8zeEdaUWZCeDUwWDM1U09JcEtIUlovU3NDVGV0NFkzRm1qMGdCa1l4emxOTTBMaVNPenFKS3VIK1VZWjc5ME5lWFk3LzNMdi9BcUtqWCtXb1R5QnNVcHNuVE9CZ2VubjU4ZlNFRkp6d0hMOFVWaWF4RUIrcGxPMFZjWHphaFgrcXZJZDNOMnpnMkFxRFBCWWZOazArdjZsNW5LN08vRzZTTTU1SEVqNHh3UVp3SWorNFNRZWp4NUhaZ1JTU0w0S2Z4RFpjdHJmWHMvR25FK3ZDaW92VkJHWHhBdHlSb0tTVnhNMVQ1Skd1b3J3YmVzbEk4TFVHMGlaVnZzbWlpUktSdHA2Q1F1bkErTWFTVkM2WEZ2WVRlVHpkak9Hc1V5MnVud2R0ZS9KWEJGRWFDK2M0VnRhV2F6bEgwazZPQ0hvRHcrd21qaER3TWVLdGpVRTBsTnRPeFZhZXN2S0ZxVkhzUFkxRkVUcW9waVdpdmFXaWNDMyt4UldBcVdDelRCbXU4bVc2d1V3NHF5UFhHdG45M29URGF1WlFpVmV4dFVneDg5NVFwU25PSWpnU1cyalcxcXRBRHYxbHZvaHYyc0hONGZ1bVkvZzZ0TE04bnFlcEpsTUtwaUJldWI4WXlMNVVmUzJOWThCbnNsS0VCSHZ2T2M1cEo2S1lHZGNDaElCenErWXNKUldvNXhBaDlVdXZBLzNtUDUydjBkVFI5T3NmRnZoc2cwN1hlbTZSZ3Nsd1FzQ01sSWdsM3o1bFlVNzBCRzIyK055MUZqcmt3MlF1emx5VGZlZ2ZHVHJlNEpDeEdvODgwNG4zeVd2bk5lZk1DMkxiT3hCdzVlM1hGSk9oRnNVby8yY1Vaa1NlVkFvdGFWRXRXNGRYNjhsS2hFN1RRQmpPWlBteVhTTUNLeERscTBvRCtLc2E4Q21zTDB3WTVWUXFpdWVlcnQxTnR3bjQwanhJTUNKaTRmais0QmJrd3hsOUhqdzkvQmJQWmk0d0RBN1pIeEJWZWNaaWljL25SdTh4cDFEaTZIbnd2M21VdGdRcGJNTWJhU2hFOEMrbDJBTzVBRzNlTGowVTA0ejIzNWVtVTNIOGRpWnhISyt3RmFzVXZOU3duSWpvSENpcW5OOUJUTUtFalEvTmZlZ29ScFR6VDQzenpzTGZnU3Y1MmlWaHpxTHd5MTlwc0NtY2ZmM3JDVm45RzlBdldnSTlma3d6KzJqSE1pZUl1eHFhNEVKemN4WHdra1VnWkdrNkVaZHlMMFloZkg5VXdrTDdUbzdVeGRmclo1R3FLblYySDZWWlRNd0xlK1R4ZTMyYndYWVZjdFBTRHpZRjdIS2NkaERKT2FGNldwVE84cHEraVpKbW4ydXNiekM0a1ZpZHdQMThzNFNFdXJ6WE9oeVp5RUczNktGeVJ5bXpRRFRvYU9OQ0tVeG1xR01DMWxFeGcwMlVCWWRpc1M0Z2ZLNFU4c0NkTzEvK08vaXdEZDcrVy9sVGdLenV4V25rNnpIQ09IT2FxMHFBdTBHRFU5NU5xdEV5TVlmNkRqcFNIeTdYa05MZStibktVUkl6NUZLRGtLY005TlJ6TlJLOHgrSEFrOGs2NVFidnZVck5ERU1qYzNNK08vM0xxNWFIaHlhNjdyMExWMFBHMDJMU0RKdjNWNHdpV0FZUnFCL0sxTjRIODExR3VrOGprWmx3UEFwOTRmWTloMEQybDBBSTJqSHBYc2pLdkgrSk1qUjRxU0JKVkdiMnRkYkpUcjVkVDY4TUMvWGFzaWwrL1VheElWaHdWc3VwbnRMcXhXdUNyQm1WTTFDU21CZ0hobjkvYzNtRmJHT1FUOWtSeHdyMklpQXQ3QzM4SjMxNElSdTVqQzlkSmRKRk8rK1k5VHV3UDlsSGpPaWNXaHRhN0YrSmFEc1lJWTF3N0dwejhSRXo5T0VSb0RXSm5hS09hcEhGcXd3RklrVmxxQ2pkY3hTalNDS0RXVHdSdU93ZnNUend3T1dobys4dHRuejJWUDYvVjQzUEFLK0I3SWZROHZIaWxVK202WWZYaTMzdlVhanZBYmdxVXdSQ0xSaGNYdnRZamF0djJFdTlvd3g1d1ZYUEJEREdmV3FLRDdObEI5RDNhYlBSL05LbWxCcmRZNEZmUEN3QmVWaDN2SHBVOXJFTDBZRVBHUklmSGNjVzR0VmdpNWxDeWczVnFaYSthRlFQYjJqdFBFUnhvdmVYZk9XWGJ0MkhiTWxZeXNFNkFsSndNN21yK2ZXTmtkdjVzWG1jMWx2WVo1M3QrQ3ZkaCswQVExbGIxK0pza0ErUDNXVEphWFBseGN4N3kzeEJxVm5NRWhIbzRKWk1zNGNhenJlWGZoeVg5aUpjN1prR0RSWnR3dmFDQVF1OHB0SkV4Rk8xYlZNT210T0RQMzVtMmx1bVN5RWw4R1R0KzZsc3RtWGhDaTRzcjk1OU93ejZLOTRUd0daWWtWWHdDb01WdTNlaEtsSFRSZUM2aHIvSWh5RUdyTkxQeEVxcjNKd2ZJQk1hTkpKNHh5QVdWUU9QMTlPZ2FaZTRVZE5pTExUeEM1Q0c1S1BIeFNabzZXOXFHZnJsc1lJTUswY3hGY2U5VXA1cUFncHR2L2ZubVdSMnhaRjhDQXRNaDVRVEFvSlcvTldjejU4cWlDYXV1akdYSzRraEgzTnVKMlh0Y09pUzd4YVdNKzZxS0p6MmNLaVFxcDFhcFF4WWNLK285T3NZZkxCTVFTUHdOVlZQZlZ1L0luMDN3R0RQUlRTQVF5QytncVVLZ3FsM3YySzNic0NmRHZLaTh5Sk1CZnhWVkdOY2xJbXZQa3BGb21ESGM4bXFlSEwrYi9PNXdPN2VOK21pa25rYmNPSXdGZ1lQa3FTY0Yvcld3QlVjb0lMeGpmMHU0cHR2QTBmVHRVdnRsK0UyQjdZTVljQ0hBN2VtUWFCMlFpNmxGTWV0amRVZDgvUDlBSllsMTY2TWFXQS9teGcyaURZRHljMVlPYzdtbFdXYm43bGdXZjB6QjFSdjMwSlJLbHFsaUppUm1JOW8yMUFaZXhwRkFZd29taFRsSTd2ZUs1L3FmRXd4c1dVVUVBczFQcjdLVWlzVldKenpVdHc0Yi9rRkhSekFVVm83MmJ6WXQ3ZHM0c21LTWE0b3VRMmR3cUxnRjRsejRoWWcydVpIdDFhc0wxNW90U1AyaEQ0ZHJUcHJnYk53aWNvK3NLNlIzd3BqL1dqOWdVSzJKaVBDeitqWHZDVVpQR1llQjN6cEZJNlZxbEpabVMyUjE2eGk3WU1uVDBkdGhDeDlndnlkNTh2ZVNYZjl5SnJwWEpKcDhaTFNhZ3MrL0JYdFBoQVU1bkVRNlZBc2VqbCt5Nm5hS0VqV0JCVVNoNWFGMjlWSDcrWEJPOFhDa21MYnlQQ0V1eU5lWGZ5NmJzcXBCcWpnNlhYakVZQlI4cVNLaWhUR21nTUNrOGx5R1pCOWI1TkxsT0QzUmZPZDVGSktqekU0am80WDZXU1VweWhmVHBBRGZ3a3I2akNYd242bXpQM1JueXNYK0dXM0ZhWmRJN2pORWxPQk4zdUo5TDkwbW9WTVRWRElqSXI1OUhaQ1N1M1ZRWXBYMXpPVExSV2hoRnFIdk40Z3MyT2xlMG9RZDJuQzQ5dGFWTmtQVzNSaWdvZ3BCRHozdVBQQTdsTFpHalkyT29JaC9OakdHWTMxak0vaFNwemR4bTlORytIbTB2TWVIZEVqK2pycUI0UFRpcnZSQTRlZStRZUMrRllrbkYvQnRyQzYzTm55OVV2K2p2aUFTQzZmd3FvYjQ2dk5JTXZOOFlINlBjTXNHUXJMejJwcnFWZitUQjJOZlNtbEM2NmxNOEJjaG5DaVNQZHZkM0R1REZTcjl0dTVuK2tjeFliTUdIUGxMVCtpdXh2N2drZTRDQ3p1Sk9xSUlOSUFueHZINy9nbnM4d2lXYjZwOFprUDc2QTdhRks0YzJxNThtLzdPcEppRXpVSTZXdzkrSWpsc3lMNHBhMmdyTTJXa1l6dTlRL0F4SlRWVDBBdDdRamxVUHBLd25EaGpDOXBWZnVjVUhwYlkwdGd0WlE9PSJ9\"},\"orderId\":\""+orderId+" \"}";

        const data = JSON.stringify({
          query: `mutation getAdyenPaymentDetails($payload: String!, $cartId: String!) {adyenPaymentDetails(payload: $payload, cart_id: $cartId) {isFinal resultCode additionalData action}}`,
          variables: {cartId: cartId, payload: payload },
        });

        const response = await this.sendGraphQLReq(host, bearer, data);
        this.adyenDetailsResponse = response.data;
        return response;

      } catch (error) {
        console.error(error);
        alert("Error occurred. Look at console for details");
      }
    },

    async adyenStatus() {
      try {
        const host = this.url;
        const bearer = this.bearer;
        const cartId = this.cartId;
        const orderId = this.orderId;

        const data = JSON.stringify({
          query: `query getAdyenPaymentStatus($orderNumber: String!, $cartId: String!) { adyenPaymentStatus(orderNumber: $orderNumber, cartId: $cartId) { isFinal resultCode additionalData action}}`,
          variables: {cartId: cartId, orderNumber: orderId },
        });

        const response = await this.sendGraphQLReq(host, bearer, data);
        this.adyenStatusResponse = response.data.adyenPaymentStatus.resultCode;
        return response;

      } catch (error) {
        console.error(error);
        alert("Error occurred. Look at console for details");
      }
    },

  },
};
</script>
