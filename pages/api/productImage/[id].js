const https = require('https')
const Shopify = require('shopify-api-node');
import { shop, key, password } from '../../../config';

async function handler(req, res){
    const { id } = req.query
    const shopify = new Shopify({
        shopName: shop,
        apiKey: key,
        password: password
    });

    // shopify.on('callLimits', (limits) => console.log(limits));
    shopify.productImage
    .list(id,[])
    .then((image) => {
        res.status(200).json({
            status:'success',
            data:image
        });
    })
    .catch((err) => {
        res.status(422).json({
            status:'error',
            data:err
        });
    });
}

export default handler;