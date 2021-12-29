const { createInvoice } = require("./createInvoice.js");
import { server } from '../../config';

async function handler(req, res){
    console.log('req.body.invoice: ', req.body.invoice);
    createInvoice(req.body.invoice, "public/invoice.pdf");
    res.status(200).json({
        status:'success',
        data:`${server}/pages/invoice.pdf`
    });
}

export default handler;