export async function sendRestReq(data, endpoint, method) {
  try {
    const host = process.env.BASE_URL;
    // const bearer = authRequired ? process.env.BEARER_TOKEN : '';
    const bearer = process.env.BEARER_TOKEN;
    const reqMethod = method;

    let response = await fetch(host + endpoint, {
      method: reqMethod,
      mode: 'cors',
      headers: {
        "Content-Type": "application/json",
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

  const response = await this.sendRestReq(data, endpoint, 'POST');
  return response;
}

export async function addProductsToCart(cartId, quote) {
  const endpoint ='/rest/default/V1/guest-carts/' + cartId + '/items';
  const data = JSON.stringify({
    "cartItem" : {
      "qty": 1,
      "sku": "24-MB02",
      "quote_id": quote
    }
  });
  const response = await this.sendRestReq(data, endpoint, 'POST');
  return response;
}

export async function removeItemFromCart(cartId, productId) {
  try {
    // Add items to cart
    const endpoint ='/rest/default/V1/guest-carts/' + cartId + '/items/' + productId;
    const data = JSON.stringify({
      "cartId": cartId,
      "itemId": productId,
    });
    const response = await this.sendRestReq(data, endpoint, 'DELETE');
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function queryCart(cartId) {
  try {
    const endpoint ='/rest/default/V1/guest-carts/' + cartId;
    const data = null;
    const response = await this.sendRestReq(data, endpoint, 'GET');
    return response;

  } catch (error) {
    console.log(error);
  }
}

// TO TEST
export async function searchProducts(searchString) {
  try {
    const endpoint =`/rest/default/V1/products/?searchCriteria[filter_groups][0][filters][0][field]=name&searchCriteria[filter_groups][0][filters][0][value]=` + searchString + `&searchCriteria[filter_groups][0][filters][0][condition_type]=like;`
    const data = null;

    const response = await this.sendRestReq(data, endpoint, 'GET');
    console.log(response);
    return response;
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

export async function setShippingAddressesOnCart(cartId, shippingAddress) {
  try {
    console.log(shippingAddress);
    const endpoint ='/rest/default/V1/guest-carts/' + cartId + '/shipping-information';
    const data = JSON.stringify({
      addressInformation: {
        shipping_address: {
          firstname: shippingAddress.firstName,
          lastname: shippingAddress.lastName,
          street: [shippingAddress.street],
          postcode: shippingAddress.postcode,
          city: shippingAddress.city,
          region: shippingAddress.region,
          country_id: shippingAddress.country_code,
          telephone: shippingAddress.telephone,
        },
        shipping_method_code: shippingAddress.shipping_method_code,
        shipping_carrier_code: shippingAddress.shipping_carrier_code,
      }
    });

    const response = await this.sendRestReq(data, endpoint, 'POST');
    return response;

  } catch (error) {
    console.error(error);
  }
}

export async function setBillingAddressOnCart(cartId, billingAddress) {
  try {
    const endpoint ='/rest/default/V1/guest-carts/' + cartId + '/billing-address';
    const data = JSON.stringify({
      address: {
        firstname: billingAddress.firstName,
        lastname: billingAddress.lastName,
        street: [billingAddress.street],
        postcode: billingAddress.postcode,
        city: billingAddress.city,
        region: billingAddress.region,
        country_id: billingAddress.country_code,
        telephone: billingAddress.telephone,
      }
    });
    const response = await this.sendRestReq(data, endpoint, 'POST');
    return response;

  } catch (error) {
    console.error(error);
  }
}

export async function estimateShippingMethods(cartId, billingAddress) {
  try {
    const endpoint ='/rest/default/V1/guest-carts/' + cartId + '/estimate-shipping-methods';
    const data = JSON.stringify({
      address: {
        firstname: billingAddress.firstName,
        lastname: billingAddress.lastName,
        street: [billingAddress.street],
        postcode: billingAddress.postcode,
        city: billingAddress.city,
        region: billingAddress.region,
        country_id: billingAddress.country_code,
        telephone: billingAddress.telephone,
      }
    });
    const response = await this.sendRestReq(data, endpoint, 'POST');
    return response;

  } catch (error) {
    console.error(error);
  }
}

// TODO
export async function getAdyenPaymentMethods(cartId) {
  try {
    const endpoint ='/rest/default/V1/guest-carts/' + cartId + '/retrieve-adyen-payment-methods';
    const data = JSON.stringify({
      "cart_id": cartId,
      "shopperLocale": "en_US",
    });

    const response = await this.sendRestReq(data, endpoint, 'POST');
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
        method: "adyen_cc",
        additional_data: {
          cc_type: stateData.paymentMethod.brand,
          stateData: stateData,
        }
      });
    } else {
      let brand = stateData.paymentMethod.type;
      data = JSON.stringify({
        method: "adyen_hpp",
        additional_data: {
          brand_code: brand,
          stateData: null,
        }
      });
    }
    const response = await this.sendGraphQLReq(data);
    return response;

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

