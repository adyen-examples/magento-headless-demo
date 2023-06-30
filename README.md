# Magento Headless Integration (with VueJs) Demo

This repository provides a demo for integrating Magento with Vue.js in a headless architecture using Gitpod as the development environment. This demo allows you to develop and test your Magento storefront using Vue.js components, while keeping the backend functionality and data management in Magento.

## Prerequisites

Before getting started, make sure you have the following:

- Github account (if you want to use Gitpod as your development environment)
- Prior knowlege of how to spin up the [Magento Plugin Demo](https://github.com/adyen-examples/adyen-magento-plugin-demo)

## Getting Started

To get started with the Magento Headless integration with Vue.js in Gitpod, follow these steps:


1. Create your [Adyen Test API Credentials](https://docs.adyen.com/user-management/how-to-get-the-api-key).
2. Environment variable (one-time setup)
 - Go to [gitpod account variables](https://gitpod.io/variables)
 - Set the `ADYEN_API_KEY`, `ADYEN_CLIENT_KEY` and `ADYEN_MERCHANT_ACCOUNT` variables (Scope: `adyen-examples/*`).
 - Create variables `BASE_URL` and `BEARER_TOKEN`. Set `#` as placeholder. These values will be updated later. (Scope: `adyen-examples/*`).
 - Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` in the Gitpod account variables as well. These will be used as your login credentials in the Magento admin dashboard. (Scope: `adyen-examples/*`).
 > __Note__ `ADMIN_PASSWORD` must contain alphanumeric characters (Magento requirement).
3. Launch the backend [Magento instance](https://github.com/adyen-examples/magento-headless-demo/tree/develop/magento-backend)



### Backend (Magento) setup
1. Login the admin dashboard using the `ADMIN_USERNAME` and `ADMIN_PASSWORD` created in the previous step and navigate to `System > Integrations > Add New Integration` to create a new integration token. 
2. Set a `Name` and set `ADMIN_PASSWORD` as `Your Password`
3. In the API option, under Resource Access, Select `Sales`, `Adyen`, `Cart` and save. These are the required resources for the frontend.
4. Click on `Activate` then `Allow` to copy your `Access Token`. 
5. Update  `BEARER_TOKEN` variable created in [Gitpod](https://gitpod.io/variables) with the copied token and save.
6. Update `BASE_URL` with URL of the Magento Instance and save.


### Frontend setup

1. Launch [Frontend](https://github.com/adyen-examples/magento-headless-demo/tree/develop/vue-frontend)
2. In the Magento Dashbboard, navigate to `Stores > Configuration > Sales > Payment methods > Adyen payments > Configure > Advanced settings > Headless integration`, update `Payment Origin URL` with the URL of the frontend (Vue) instance and `Payment Return URL` with same URL plus `/result` then save.
3. Refresh the frontend view to load data from backend

NOTE: To allow the Adyen Drop-In and Components to load, you have to add `https://*.gitpod.io` as allowed origin for your chosen set of [API Credentials](https://ca-test.adyen.com/ca/ca/config/api_credentials_new.shtml)



## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please create an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).


## Resources

- [Adyen Magento Headless Documentation](https://docs.adyen.com/plugins/adobe-commerce/adobe-commerce-headless-integration)
- [Vue.js Documentation](https://vuejs.org/)
- [Magento DevDocs](https://devdocs.magento.com/)
- [Gitpod Documentation](https://www.gitpod.io/docs/)
