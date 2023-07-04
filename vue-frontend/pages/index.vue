<template>
  <div class="main-container">
    <div class="info">
      <h1>Select a demo</h1>
      <p>
        Click to view an interactive example of headless checkout integration for Adobe Commerce platform +
        <a
          href="https://github.com/Adyen/adyen-magento2"
        >
          Adyen plugin
        </a>
        for online payments.
      </p>
      <p>
        Make sure the payment method you want to use are enabled for your
        account. Refer
        <a
          href="https://docs.adyen.com/payment-methods#add-payment-methods-to-your-account"
        >the documentation</a
        >
        to add missing payment methods.
      </p>
      <p>
        To learn more about client-side integration solutions, check out
        <a href="https://docs.adyen.com/checkout">
          Online payments.
        </a>
      </p>
    </div>
    <ul class="integration-list">
      <li class="integration-list-item">
        <nuxt-link to="/preview" class="integration-list-item-link">
          <div class="title-container">
            <p class="integration-list-item-title">GraphQL Checkout</p>
          </div>
        </nuxt-link>
      </li>
      <li class="integration-list-item">
        <nuxt-link to="/" class="integration-list-item-link">
          <div class="title-container">
            <p class="integration-list-item-title">REST Checkout (TBD)</p>
          </div>
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  head: {
    title: "Checkout Demo"
  }
};
</script>
