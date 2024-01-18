const express = require("express");
const consola = require("consola");
const dotenv = require("dotenv");
const { v4: uuid } = require("uuid");
const { hmacValidator } = require('@adyen/api-library');
const { Client, Config, CheckoutAPI } = require("@adyen/api-library");
const { Nuxt, Builder } = require("nuxt");
const https = require('https');
const fs = require('fs');
// Init app
const app = express();

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Import and set Nuxt.js options
const nuxtConfig = require("../nuxt.config.js");
nuxtConfig.dev = process.env.NODE_ENV !== "production";

// Enables environment variables by parsing the .env file and assigning it to process.env
dotenv.config({
  path: "./.env"
});

// // Adyen Node.js API library boilerplate (configuration, etc.)
// const config = new Config();
// config.apiKey = process.env.ADYEN_API_KEY;
// const client = new Client({ config });
// client.setEnvironment("TEST"); // change to LIVE for production
// const checkout = new CheckoutAPI(client);

// Setup and start Nuxt.js
async function start() {
  const nuxt = new Nuxt(nuxtConfig);

  const { host, port } = nuxt.options.server;
  await nuxt.ready();
  if (nuxtConfig.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }

  app.use(nuxt.render);
  //app.use(https);
  https.createServer(nuxt.options.server.https, app).listen(port, host);
 // consola.ready({
 //   message: `Server listening on ${host}:${port}`,
 //   badge: true
 // });
}
start();
