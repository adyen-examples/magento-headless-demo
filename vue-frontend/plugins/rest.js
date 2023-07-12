export async function sendRestReq(data, endpoint) {
  try {
    const host = process.env.BASE_URL;
    const bearer = process.env.BEARER_TOKEN;

    let response = await fetch(host + endpoint, {
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
  const endpoint ='/rest/default/V1/guest-carts';
  const data = JSON.stringify({});

  const response = await this.sendRestReq(data, endpoint);

  console.log(response);

}

// TODO
export async function addProductsToCart(cartId) {
  const endpoint ='/rest/default/V1/guest-carts/' + cartId + '/items';
  const data = JSON.stringify({
    "cartItem" : {
      "qty": 1,
      "sku": "24-MB02",
      "quote_id": "4"
    }
  });

  const response = await this.sendRestReq(data, endpoint);
  console.log(response);
}

// TODO
export async function queryCart(cartId) {
  try {
    const endpoint ='/rest/default/V1/guest-carts/' + cartId + '/items';
    const data = null;
    const response = await this.sendRestReq(data, endpoint);
    return response;

  } catch (error) {
    console.log(error);
  }
}

// TODO
export async function searchProducts(searchString) {
  try {
    const endpoint =`/rest/default/V1/products/?
        searchCriteria[filter_groups][0][filters][0][field]=name&
        searchCriteria[filter_groups][0][filters][0][value]=` + searchString + `&
        searchCriteria[filter_groups][0][filters][0][condition_type]=like;`
    const data = JSON.stringify({});

    const response = await this.sendRestReq(data, endpoint);
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
}

// TODO
export async function removeItemFromCart(cartId, productId) {
  try {
    // Add items to cart
    const endpoint ='/rest/default/V1/guest-carts/' + cartId + '/items';
    const data = null;

    const response = await this.sendRestReq(data, endpoint);
    return response.data.removeItemFromCart;

  } catch (error) {
    console.error(error);
  }
}

// TODO
export async function setGuestEmailOnCart(cartId, shopperEmail) {
  try {
    const endpoint ='/rest/default/V1/guest-carts/' + cartId + '/items';
    const data = null;

    const response = await this.sendRestReq(data, endpoint);
    return response;

  } catch (error) {
    console.error(error);
  }
}

// TODO
export async function setShippingAddressesOnCart(cartId, shippingAddress) {
  try {
    const endpoint ='/rest/default/V1/guest-carts/' + cartId + '/items';
    const data = null;

    const response = await this.sendRestReq(data, endpoint);

  } catch (error) {
    console.error(error);
  }
}

// TODO
export async function setBillingAddressOnCart(cartId, billingAddress) {
  try {
    const endpoint ='/rest/default/V1/guest-carts/' + cartId + '/items';
    const data = null;

    const response = await this.sendRestReq(data, endpoint);
    return response.data.setBillingAddressOnCart;

  } catch (error) {
    console.error(error);
  }
}

// TODO
export async function setShippingMethodsOnCart(cartId, method) {
  try {
    const endpoint ='/rest/default/V1/guest-carts/' + cartId + '/items';
    const data = null;

    const response = await this.sendRestReq(data, endpoint);
    return response.data.setShippingMethodsOnCart;

  } catch(error) {
    console.error(error);
  }
}

// TODO
export async function getAdyenPaymentMethods(cartId) {
  try {
    const endpoint ='/rest/default/V1/guest-carts/' + cartId + '/items';
    const data = null;

    const response = await this.sendRestReq(data, endpoint);
    return response;

  } catch(error) {
    console.error(error);
  }
}

// TODO
export async function setPaymentMethodAndPlaceOrder(cartId, stateData) {
  try {
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
    } else {
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

  } catch(error){
    console.error(error);
  }
}

// TODO
export async function getAdyenPaymentStatus(cartId, orderId) {
  try {
    const endpoint ='/rest/default/V1/guest-carts/' + cartId + '/items';
    const data = null;

    const response = await this.sendRestReq(data, endpoint);
    return response.data.adyenPaymentStatus.resultCode;

  } catch (errror) {
    console.log(error);
  }
}

// TODO
export async function getAdyenPaymentDetails(cartId, payload) {
  try {
    const endpoint ='/rest/default/V1/guest-carts/' + cartId + '/items';
    const data = null;

    const response = await this.sendRestReq(data, endpoint);
    return response.data;

  } catch (error) {
    console.log(error);
  }
}

