const https = require('https')
const Shopify = require('shopify-api-node');

async function handler(req, res){
    console.log('gffd');

    const shopify = new Shopify({
        shopName: 'royalgalleriapk',
        apiKey: 'b9a5814dc31133c0c9214b7e4f1b0b77',
        password: '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'
    });

    // shopify.on('callLimits', (limits) => console.log(limits));
    shopify.order
    .list({ limit: 100 })
    .then((orders) => {
        console.log('orders get')
        res.status(200).json({
            status:'success',
            data:orders
        });
    })
    .catch((err) => {
        console.error(err)
        res.status(422).json({
            status:'error',
            data:err
        });
    });

    // const options = {
    //     hostname: 'royalgalleriapk.myshopify.com',
    //     path: 'https://b9a5814dc31133c0c9214b7e4f1b0b77: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@royalgalleriapk.myshopify.com/admin/api/2021-10/orders.json',
    //     method: 'GET'
    // }

    // const response = https.request(options, res => {
    //     console.log(`statusCode: ${res.statusCode}`)
        
    //     res.on('data', d => {
    //         process.stdout.write(d);
    //     })
    // })
    
    // response.on('error', error => {
    //     console.error('error')
    //     console.error(error)
    // })
    
    // response.end()
}

export default handler;