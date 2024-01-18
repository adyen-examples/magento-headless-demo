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
      .then(result => response = result)

    if (response.errors) {
      const errorText = response.errors
        .reduce((str, err) => str + err.message + "\n", "");
      throw Error(errorText);
    }
    return response;

  } catch (error) {
    console.error(error);
  }
}

export async function getCartId() {
  const data = JSON.stringify({
    query: `mutation {
      createEmptyCart
    }`,
  });

  const response = await this.sendGraphQLReq(data);
  return response.data.createEmptyCart;
}

export async function queryCart(cartId) {
  const data = JSON.stringify({
    query: `{cart(cart_id: ` + `"` + cartId + `"` + `){
      email
      billing_address {
        city
        country {
          code
          label
        }
        firstname
        lastname
        postcode
        region {
          code
          label
        }
        street
        telephone
      }
      shipping_addresses {
        firstname
        lastname
        street
        city
        postcode
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
}

export async function searchProducts(searchString) {
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
}

export async function addProductsToCart(cartId, sku, quantity) {
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
}

export async function removeItemFromCart(cartId, productId) {
  // Add items to cart
  const data = JSON.stringify({
    query: `mutation{
      removeItemFromCart(
        input: {
          cart_id: ` + '"' + cartId + '"' + `,
          cart_item_id: ` + '"' + productId + '"' + `
        }) {
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
  return response.data.removeItemFromCart;
}

export async function setGuestEmailOnCart(cartId, shopperEmail) {
  const data = JSON.stringify({
    query:  `mutation {
      setGuestEmailOnCart(
      input: {
        cart_id: ` + '"' + cartId + '"' + `,
        email: `+ '"' + shopperEmail + '"' + `
      }) {
        cart {
          email
        }
      }
    }`,
  });

  const response = await this.sendGraphQLReq(data);
  return response;
}

export async function setShippingAddressesOnCart(cartId, shippingAddress) {
  const data = JSON.stringify({
    query: `mutation{
        setShippingAddressesOnCart(
          input: {
            cart_id:` + '"' + cartId + '"' + `,
            shipping_addresses: [{
              address: {
                firstname:` + '"' + shippingAddress.firstName + '"' + `,
                lastname:` + '"' + shippingAddress.lastName + '"' + `,
                company:`  + '"' + "Magento" + '"' + `,
                street:[` + '"' + shippingAddress.street + '"' + `],
                city:`  + '"' + shippingAddress.city + '"' + `,
                region:` + '"' + shippingAddress.region + '"' + `,
                postcode:` + '"' + shippingAddress.postcode + '"' + `,
                country_code:` + '"' + shippingAddress.country_code + '"' + `,
                telephone:` + '"' + shippingAddress.telephone + '"' + `,
                save_in_address_book: false
              }
            }
          ]}) {
          cart {
            shipping_addresses {
              firstname
              lastname
              company
              street
              city
              region {
                code
                label
              }
              postcode
              telephone
              available_shipping_methods {
                available
                amount {
                  value
                  currency
                }
                carrier_code
                carrier_title
                error_message
                method_code method_title
              }
              country {
                code
                label
              }
            }
          }
        }
      }`,
  });

  const response = await this.sendGraphQLReq(data);
  return response.data.setShippingAddressesOnCart;
}

export async function setBillingAddressOnCart(cartId, billingAddress) {
  const data = JSON.stringify({
    query: `mutation {
      setBillingAddressOnCart(
        input: {
          cart_id:` + '"' + cartId + '"' +`,
          billing_address: {
            address: {
              firstname: ` + '"' + billingAddress.firstName + '"' + `,
              lastname: ` + '"' + billingAddress.lastName + '"' + `,
              company: "Magento",
              street: [` + '"' + billingAddress.street + '"'+ `],
              city:` + '"' + billingAddress.city + '"' + `,
              region:` + '"' + billingAddress.region + '"' + `,
              postcode:` + '"' + billingAddress.postcode + '"' + `,
              country_code:` + '"' + billingAddress.country_code + '"' + `,
              telephone:` + '"' + billingAddress.telephone + '"' + `,
              save_in_address_book: false
            },
            same_as_shipping: true
          }
        }) {
          cart {
            billing_address {
              firstname
              lastname
              company
              street
              city
              region {
                code label
              }
              postcode
              telephone
              country {
                code
                label
              }
            }
          }
        }
      }`,
  });

  const response = await this.sendGraphQLReq(data);
  return response.data.setBillingAddressOnCart;
}

export async function setShippingMethodsOnCart(cartId, method) {
  const data = JSON.stringify({
    query: `mutation {
      setShippingMethodsOnCart(
        input: {
          cart_id: `+ `"` + cartId + `"`+ `,
          shipping_methods: [
            {
              carrier_code: ` + `"` + method.carrier_code + `"` + `,
              method_code:  ` + `"` + method.method_code + `"`
      + `}]
        }) {
          cart {
          shipping_addresses {
            selected_shipping_method {
              carrier_code
              carrier_title
              method_code
              method_title
              amount {
                value
                currency
              }
            }
          }
        }
      }
    }`,
  });

  const response = await this.sendGraphQLReq(data);
  return response.data.setShippingMethodsOnCart;
}

export async function getAdyenPaymentMethods(cartId) {
  const data = JSON.stringify({
    query: `query getAdyenPaymentMethods($cartId: String!) {
      adyenPaymentMethods(cart_id: $cartId) {
        paymentMethodsExtraDetails {
          type
          icon {
            url
            width
            height
          }
          isOpenInvoice
          configuration {
            amount {
              value
              currency
            }
            currency
          }
        }
        paymentMethodsResponse {
          paymentMethods {
            name
            type
            brand
            brands
            issuers {
              id
              name
            }
            configuration {
              merchantId
              merchantName
            }
            details {
              key
              type
              items {
                id
                name
              }
              optional
            }
          }
        }
      }
    }`,
    variables: {cartId: cartId},
  });

  const response = await this.sendGraphQLReq(data);
  return response;
}

export async function setPaymentMethodAndPlaceOrder(cartId, stateData) {
  let data = "";
  if (stateData.paymentMethod.type === "scheme") {
    data = JSON.stringify({
      query: `mutation setPaymentMethod($cartId: String! $stateData: String!) {
        setPaymentMethodOnCart(
          input: {
            cart_id: $cartId
            payment_method: {
              code:`+ '"' + "adyen_cc" + '"'+ `,
              adyen_additional_data_cc: {
                cc_type:` + '"' + stateData.paymentMethod.brand + '"' + `,
                stateData: $stateData
              }
            }
          }) {
            cart {
              selected_payment_method {
                code
                title
              }
            }
          }
          placeOrder(
            input: {
              cart_id: $cartId
            }) {
              order {
                order_id
                adyen_payment_status {
                  isFinal
                  resultCode
                  additionalData
                  action
                }
              }
            }
          }`,
      variables: {cartId: cartId, stateData: JSON.stringify(stateData)},
    });
  }
  else {
    let brand = stateData.paymentMethod.type;
    data = JSON.stringify({
      query: `mutation setPaymentMethod($cartId: String! $stateData: String!) {
        setPaymentMethodOnCart(
          input: {
            cart_id: $cartId
            payment_method: {
              code:` + '"' + "adyen_hpp" + '"' + `,
              adyen_additional_data_hpp: {
                brand_code:` + '"' + brand + '"' + `,
                stateData: $stateData
              }
            }
          }) {
            cart {
              selected_payment_method {
                code
                title
              }
            }
          }
          placeOrder(
            input: {
              cart_id: $cartId
            }) {
              order {
                order_id adyen_payment_status {
                  isFinal
                  resultCode
                  additionalData
                  action
                }
              }
            }
          }`,
      variables: {cartId: cartId, stateData: JSON.stringify(stateData) },
    });
  }

  const response = await this.sendGraphQLReq(data);
  return response.data.placeOrder;
}

export async function getAdyenPaymentStatus(cartId, orderId) {
  const data = JSON.stringify({
    query: `query getAdyenPaymentStatus($orderNumber: String!, $cartId: String!) {
      adyenPaymentStatus(orderNumber: $orderNumber, cartId: $cartId) {
        isFinal
        resultCode
        additionalData
        action
      }
    }`,
    variables: {cartId: cartId, orderNumber: orderId },
  });

  const response = await this.sendGraphQLReq(data);
  return response.data.adyenPaymentStatus.resultCode;
}

export async function getAdyenPaymentDetails(cartId, payload) {
  const data = JSON.stringify({
    query: `mutation getAdyenPaymentDetails($payload: String!, $cartId: String!) {
      adyenPaymentDetails(payload: $payload, cart_id: $cartId) {
        isFinal
        resultCode
        additionalData
        action
      }
    }`,
    variables: {cartId: cartId, payload: payload },
  });

  const response = await this.sendGraphQLReq(data);
  return response.data;
}

export async function getCountries() {
  const data = JSON.stringify({
    query: `{
      countries {
        id
        two_letter_abbreviation
        full_name_english
        full_name_locale
        available_regions {
            id
            code
            name
        }
      }
    }`,
  });

  const response = await this.sendGraphQLReq(data);
  return response.data;
}
