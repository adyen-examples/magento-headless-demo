# Magento Headless Integration with VueJs Demo - Gitpod

This repository provides a demo template for integrating Magento with Vue.js in a headless architecture using Gitpod as the development environment. This demo allows you to develop and test your Magento storefront using Vue.js components, while keeping the backend functionality and data management in Magento.

## Prerequisites

Before getting started, make sure you have the following tools installed:

- Gitpod account (if you want to use Gitpod as the development environment)
- Magento instance (either a local setup or a remote server)

## Getting Started

To get started with the Magento Headless integration with Vue.js in Gitpod, follow these steps:


1. Add your API Keys to your Gitpod variables
2. Launch the frontend (VueJs Sample)[https://github.com/adyen-examples/magento-headless-demo/tree/develop/vue-frontend] and backend (Magento instance)[https://github.com/adyen-examples/magento-headless-demo/tree/develop/magento-backend]


### Magento setup
- Login the admin dashboard and navigate to `System > Integrations > Add New Integration`to create a new integration token
- Navigate to `Stores > Configuration > Sales > Payment methods > Adyen payments > Configure > Advanced settings > Headless integration` and update `Payment Origin URL` and `Payment Return URL` 
- Expose the ports to make it publicly accessible from the frontend

### Frontend setup
- Configure Magento API endpoint:

   Open the `vue-frontend/pages/preview.vue` file and update the `baseURL` variable with your Magento Instance URL endpoint and `bearerToken` with the integration token created in Magento.

- Refresh the frontend instance to load data from the now configure backend


## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please create an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).


## Resources

- [Vue.js Documentation](https://vuejs.org/)
- [Magento DevDocs](https://devdocs.magento.com/)
- [Gitpod Documentation](https://www.gitpod.io/docs/)
