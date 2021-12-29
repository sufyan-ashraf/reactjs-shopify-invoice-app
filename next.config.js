module.exports = {
    serverRuntimeConfig: {
        PROJECT_ROOT: __dirname,
        secret: 'THIS IS USED TO SIGN AND VERIFY JWT TOKENS, REPLACE IT WITH YOUR OWN SECRET, IT CAN BE ANY STRING OK?'
    },
    publicRuntimeConfig: {
        apiUrl: process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000/api' // development api
            : 'https://shopify-invoice-app.vercel.app/api' // production api
    }
}
