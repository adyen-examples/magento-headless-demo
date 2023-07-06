export async function sendGraphQLReq(data) {
  try {
    const host = process.env.BASE_URL;
    const bearer = process.env.BEARER_TOKEN;

    let response = await fetch(host +'/graphql', {
      method: 'POST',
      mode: 'cors',
      headers: {
        "Content-Type": "application/json",
        'Content-Length': data.length,
        Authorization: 'Bearer '+ bearer,
        'Origin': host,
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
}

export async function getCartId() {
  try {
    const data = JSON.stringify({
      query: `mutation {
        createEmptyCart
      }`,
    });

    const response = await this.sendGraphQLReq(data);
    return response.data.createEmptyCart;

  } catch (error) {
    console.error(error);
  }
}

export async function queryCart(cartId) {
  try {
    const data = JSON.stringify({
      query: `{cart(cart_id: ` + `"` + cartId + `"` + `){
        shipping_addresses {
          firstname
          lastname
          street
          city
          region {
            code
            label
          }
          country {
            code
            label
          }
          telephone
          available_shipping_methods {
            amount {
              currency
              value
            }
            available
            carrier_code
            carrier_title
            error_message
            method_code
            method_title
            price_excl_tax {
              value
              currency
            }
            price_incl_tax {
              value
              currency
            }
          }
          selected_shipping_method {
            amount {
              value
              currency
            }
            carrier_code
            carrier_title
            method_code
            method_title
          }
        }
        items {
          uid
          quantity
          product {
            name
            sku
            price_tiers {
              quantity
              final_price {
                value
              }
              discount {
                amount_off
                percent_off
              }
            }
          }
          prices {
            price {
              value
            }
          }
        }
        prices {
          discounts {
            label
            amount {
              value
            }
          }
          subtotal_excluding_tax {
            value
          }
          applied_taxes {
            label
            amount {
              value
            }
          }
        }
        prices {
          grand_total {
            value
            currency
          }
        }
      }
    }`,
    });
    const response = await this.sendGraphQLReq(data);
    return response;

  } catch (error) {
    console.log(error);
  }
}

export async function searchProducts(searchString) {
  try {
    const data = JSON.stringify({
      query: `{
        products(
          search: ` + searchString + `
          filter: {
            price: {
              to: "50"
            }
          }
          pageSize: 25
          sort: {
            price: DESC
          }) {
            items {
              name
              sku
              image {
                url
                label
                position
                disabled
              }
              price_range {
                minimum_price {
                  regular_price {
                    value
                    currency
                  }
                }
              }
            }
            total_count page_info
            {
              page_size
            }
          }
        }`,
    });

    const response = await this.sendGraphQLReq(data);
    return response.data.products.items;

  } catch (error) {
    console.error(error);
  }
}

export async function addProductsToCart(cartId, sku, quantity) {
  try {
    const products = '{ quantity:' + quantity + ' sku:' + '"' + sku + '"' + '}';

    // Add items to cart
    const data = JSON.stringify({
      query: `mutation {
        addProductsToCart( cartId: `+ '"' + cartId + '"' + ` cartItems: [` + products + `] ) {
          cart {
            items {
              id
              product {
                name
                sku
                image {
                  url
                  label
                  position
                  disabled
                }
                price_range {
                  minimum_price {
                    regular_price {
                      value
                      currency
                    }
                  }
                }
              }
              quantity
            }
            prices {
              grand_total {
                value
                currency
              }
            }
          }
        }
      }`,
    });
    const response = await this.sendGraphQLReq(data);
    return response.data.addProductsToCart;

  } catch (error) {
    console.error(error);
  }
}

export async function removeItemFromCart(cartId, productId) {
  try {
    // Add items to cart
    const data = JSON.stringify({
      query: `mutation{ removeItemFromCart( input: { cart_id: `
        + '"' + cartId + '"'
        + `, cart_item_id: `
        + '"' + productId + '"'
        + ` }) {  cart {  items { id product { name  sku image { url label position disabled } price_range { minimum_price { regular_price { value currency } } } } quantity } prices { grand_total { value currency } }  } } }`,
    });
    const response = await this.sendGraphQLReq(data);
    return response.data.removeItemFromCart;

  } catch (error) {
    console.error(error);
  }
}

export async function setGuestEmailOnCart(cartId, shopperEmail) {
  try {
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
  }
}

export async function setShippingAddressesOnCart(cartId, shippingAddress) {
  try {
    const data = JSON.stringify({
      query: `mutation{setShippingAddressesOnCart(input: {cart_id:` + '"'
        + cartId + '"'
        + `, shipping_addresses: [{address: {firstname:`
        + '"' + shippingAddress.firstName + '"'
        + `, lastname:` + '"'
        + shippingAddress.lastName + '"'
        + `, company:`
        + '"' + "Magento"
        + '"'
        + `, street:[`
        + '"' + shippingAddress.street + '"'
        + `], city:`
        + '"' + shippingAddress.city + '"'
        + `, region:`
        + '"' + shippingAddress.region + '"'
        + `, postcode:`
        + '"' + shippingAddress.postcode + '"'
        + `, country_code:`
        + '"' + shippingAddress.country_code + '"'
        + `, telephone:`
        + '"' + shippingAddress.phone + '"'
        + `, save_in_address_book: false}}]}) {cart {shipping_addresses {firstname lastname company street city region {code label} postcode telephone available_shipping_methods { available amount {value currency } carrier_code carrier_title error_message method_code method_title } country { code label }}}}}`,
    });
    const response = await this.sendGraphQLReq(data);
    return response.data.setShippingAddressesOnCart;

  } catch (error) {
    console.error(error);
  }
}

export async function setBillingAddressOnCart(cartId, billingAddress) {
  try {
    const data = JSON.stringify({
      query: 'mutation{setBillingAddressOnCart(input: {cart_id:'
        + '"' + cartId + '"' +
        ', billing_address: {address: {firstname: '
        + '"' + billingAddress.firstName + '"'
        + ', lastname: '
        + '"' + billingAddress.lastName + '"'
        + ', company: "Magento" , street: ['
        + '"' + billingAddress.street + '"'
        + '], city:'
        + '"' + billingAddress.city + '"'
        + ', region:'
        + '"' + billingAddress.region + '"'
        + ', postcode:'
        + '"' + billingAddress.postcode + '"'
        + ', country_code:'
        + '"' + billingAddress.country_code + '"'
        + ', telephone:'
        + '"' + billingAddress.phone + '"'
        + ', save_in_address_book: false }, same_as_shipping: true }}) {cart {billing_address {firstname lastname company street city region { code label} postcode telephone country { code label }}} }}',
    });
    const response = await this.sendGraphQLReq(data);
    return response.data.setBillingAddressOnCart;

  } catch (error) {
    console.error(error);
  }
}

export async function setShippingMethodsOnCart(cartId, method) {
  try {
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

  } catch(error) {
    console.error(error);
  }
}

export async function getAdyenPaymentMethods(cartId) {
  try {
    const data = JSON.stringify({
      query: `query getAdyenPaymentMethods($cartId: String!) {adyenPaymentMethods(cart_id: $cartId) {paymentMethodsExtraDetails {type icon { url width height} isOpenInvoice configuration {amount {value currency} currency}} paymentMethodsResponse { paymentMethods { name type brand brands issuers {id name} configuration { merchantId merchantName} details { key type items { id name } optional }}}}}`,
      variables: {cartId: cartId},
    });

    const response = await this.sendGraphQLReq(data);
    return response;

  } catch(error) {
    console.error(error);
  }
}

export async function setPaymentMethodAndPlaceOrder(cartId, stateData) {
  try {
    let data = "";
    if (stateData.paymentMethod.type === "scheme") {
      data = JSON.stringify({
        query: `mutation setPaymentMethod($cartId: String! $stateData: String!) { setPaymentMethodOnCart( input: { cart_id: $cartId payment_method: { code:`
          + '"' + "adyen_cc" + '"'
          + `, adyen_additional_data_cc: { cc_type:`
          + '"' + stateData.paymentMethod.brand + '"'
          + `, stateData: $stateData}}}) {cart { selected_payment_method { code title } }} placeOrder( input: { cart_id: $cartId }) { order { order_id adyen_payment_status { isFinal resultCode additionalData action}}}}`,
        variables: {cartId: cartId, stateData: JSON.stringify(stateData)},
      });
    } else {
      let brand = stateData.paymentMethod.type;
      data = JSON.stringify({
        query: `mutation setPaymentMethod($cartId: String! $stateData: String!) { setPaymentMethodOnCart( input: { cart_id: $cartId payment_method: { code:`
          + '"' + "adyen_hpp" + '"'
          + `, adyen_additional_data_hpp: { brand_code:`
          + '"' + brand + '"'
          + `, stateData: $stateData}}}) {cart { selected_payment_method { code title } }} placeOrder( input: { cart_id: $cartId }) { order { order_id adyen_payment_status { isFinal resultCode additionalData action}}}}`,
        variables: {cartId: cartId, stateData: JSON.stringify(stateData) },
      });
    }
    const response = await this.sendGraphQLReq(data);
    return response.data.placeOrder;

  } catch(error){
    console.error(error);
  }
}

export async function getAdyenPaymentStatus(cartId, orderId) {
  try {
    const data = JSON.stringify({
      query: `query getAdyenPaymentStatus($orderNumber: String!, $cartId: String!) { adyenPaymentStatus(orderNumber: $orderNumber, cartId: $cartId) { isFinal resultCode additionalData action}}`,
      variables: {cartId: cartId, orderNumber: orderId },
    });

    const response = await this.sendGraphQLReq(data);
    return response.data.adyenPaymentStatus.resultCode;

  } catch (errror) {
    console.log(error);
  }
}

export async function getAdyenPaymentDetails(cartId, payload) {
  try {
    const data = JSON.stringify({
      query: `mutation getAdyenPaymentDetails($payload: String!, $cartId: String!) {adyenPaymentDetails(payload: $payload, cart_id: $cartId) {isFinal resultCode additionalData action}}`,
      variables: {cartId: cartId, payload: payload },
    });

    const response = await graphql.sendGraphQLReq(data);
    return response;

  } catch (error) {
    console.log(error);
  }
}
