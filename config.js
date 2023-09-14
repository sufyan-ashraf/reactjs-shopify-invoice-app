const dev = process.env.NODE_ENV !== 'production';

const server = dev ? 'http://localhost:3000' : 'https://shopify-invoice-app.vercel.app';
const password = process.env.YOUR_SHOPIFY_APP_PASSWORD;
const key = process.env.YOUR_SHOPIFY_APP_KEY;
const shop = process.env.YOUR_SHOPIFY_APP_NAME;

export {server, password, key, shop};
