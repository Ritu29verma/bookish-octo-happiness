const paypal = require('@paypal/checkout-server-sdk');

const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
); // Use LiveEnvironment for production
const client = new paypal.core.PayPalHttpClient(environment);

module.exports = client;
