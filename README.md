# Magento Headless Integration (with VueJs) Demo

This repository provides a demo for integrating Magento with Vue.js in a headless architecture using Gitpod as the development environment. This demo allows you to develop and test your Magento storefront using Vue.js components, while keeping the backend functionality and data management in Magento.

## Prerequisites

Before getting started, make sure you have the following:

- Github account

## Getting Started

To get started with the Magento Headless integration with Vue.js in Gitpod, follow these steps:


1. Create your [Adyen Test API Credentials](https://docs.adyen.com/user-management/how-to-get-the-api-key).
2. Environment variable (one-time setup).
 - Go to [Gitpod account variables](https://gitpod.io/variables)
 - Add and set the `ADYEN_API_KEY`, `ADYEN_CLIENT_KEY` and `ADYEN_MERCHANT_ACCOUNT` variables (scope: `adyen-examples/*`).
 - Add and set the `PORT` variable to `8080` (scope: `adyen-examples/*`), which is used for the frontend (Vue.js) instance.
 - Create variables `BASE_URL` and `BEARER_TOKEN`. Set `#` as its placeholder (scope: `adyen-examples/*`). These values will be updated later after we've configured the backend.
 - Add and set `ADMIN_USERNAME` and `ADMIN_PASSWORD` in the Gitpod account variables as well. These will be used as your login credentials in the Magento admin dashboard. (Scope: `adyen-examples/*`).
 > __Warning__ The `ADMIN_PASSWORD` **must** be at least 7 characters in length and must include at least one alphabetic and at least one numeric character (Magento requirement).


### Backend (Magento) setup
1. Launch the backend [Magento instance](magento-backend) by clicking the button below.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/adyen-examples/magento-headless-demo/tree/main/magento-backend)

 - **Wait around ~260s (4 minutes)** (for the Magento installation). You should have `magento2-container  | Starting periodic command scheduler: cron.` before proceeding to next step.
 - Open a new Terminal in Gitpod, navigate to backend directory `cd magento-backend` and run `./install.sh` to install and configure the Adyen payment plugin.

> __Note__ This part of the integration is an extension of the [Magento Plugin Demo](https://github.com/adyen-examples/adyen-magento-plugin-demo). 

2. Login the admin dashboard by navigating to the public URL/admin generated by gitpod (e.g. `https://adyenexampl-magentohead-gbqa16g1p1n.ws-eu101.gitpod.io/admin`). 
3. You can login using the `ADMIN_USERNAME` and `ADMIN_PASSWORD` created in the previous step and navigate to `System` > `Integrations` > `Add New Integration` to create a new integration token.
3. Under the `Integration Info` tab, enter a `Name`, set `ADMIN_PASSWORD` as `Your Password`, do not hit `Save` yet.
4. In the `API option` tab, you can find several folders under `Resource Access`. Select `Sales`, `Adyen` (under 'System'), `Carts` and hit `Save`. These are the required resources for the frontend.
5. Click on `Activate`, followed by `Allow` to get your `Access Token`. 
6. Go to [Gitpod](https://gitpod.io/variables) and update `BEARER_TOKEN` with the copied `Access Token` and save.
7. Update `BASE_URL` with URL (e.g. `https://adyenexampl-magentohead-gbqa16g1p1n.ws-eu101.gitpod.io/`) of the Magento Instance and save.


### Frontend (Vue.js) setup
1. Launch the frontend [Vue.js](vue-frontend) by clicking the button below.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/adyen-examples/magento-headless-demo/tree/main/vue-frontend)

2. In the Magento Dashbboard, navigate to `Stores` > `Configuration` > `Sales` > `Payment methods` > `Adyen payments` > `Configure` > `Advanced settings` > `Headless integration`.
3. Update the `Payment Origin URL` with the URL of the frontend (Vue) instance (e.g. `https://8080-adyenexampl-magentohead-qtjz67kufbw.ws-eu101.gitpod.io/`).
4. Update `Payment Return URL` with same URL, but append `/result` to the URL (e.g. `https://8080-adyenexampl-magentohead-qtjz67kufbw.ws-eu101.gitpod.io/result`) , then hit `Save Config`.
5. Refresh the frontend view to load data from backend.

 > __Note__ To allow the Adyen Drop-In and Components to load, you have to add `https://*.gitpod.io` as allowed origin for your chosen set of [API Credentials](https://ca-test.adyen.com/ca/ca/config/api_credentials_new.shtml).



## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please create an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).


## Resources

- [Adyen Magento Headless Documentation](https://docs.adyen.com/plugins/adobe-commerce/adobe-commerce-headless-integration)
- [Vue.js Documentation](https://vuejs.org/)
- [Magento DevDocs](https://devdocs.magento.com/)
- [Gitpod Documentation](https://www.gitpod.io/docs/)
