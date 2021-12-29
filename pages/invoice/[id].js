import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { AnimatePresence } from 'framer-motion'
import dayjs from 'dayjs'
import { saveAs } from 'file-saver';

import Wrapper from '../../components/invoice/Wrapper'
import EditInvoiceForm from '../../components/form/EditInvoiceForm'
import DeletePopup from '../../components/invoice/DeletePopup'
import HomeLink from '../../components/invoice/HomeLink'
import InvoiceHeader from '../../components/invoice/InvoiceHeader'
import InvoiceBody from '../../components/invoice/InvoiceBody'
import InvoiceFooter from '../../components/invoice/InvoiceFooter'
import { markAsPaid } from '../../utilities/Invoices'
import { server } from '../../config';
import getConfig from 'next/config';
const { serverRuntimeConfig } = getConfig();

export default function Invoice({ invoices, setInvoices, handleDelete}) {
    const router = useRouter()
    const [id, setId] = useState(null)
    const [invoice, setInvoice] = useState(null)
    const [popupIsOpen, setPopupIsOpen] = useState(false)
    const [formIsOpen, setFormIsOpen] = useState(false)

    // useEffect(() => {
    //     console.log('body invoice: ', invoices?.find(invoice => router.query.id === invoice.id));
    //     setId(router.query.id)
    //     setInvoice(invoices?.find(invoice => router.query.id === invoice.id))
    // }, [router.query, invoices])

    function handlePaid() {
        markAsPaid(id, invoices, setInvoices)
    }

    async function getInvoiceHandler() {
        const response = await fetch(`${server}/api/order/${router.query.id}`, {
            method:"GET",
            headers:{
                'Content-Type':'application/json',
                'Accept': 'application/json'
            }
        });

        const response_data = await response.json();
		let invoice_res = response_data.status == 'success' ? response_data.data : [];
		setInvoice(invoice_res);
        // console.log('invoice_res', invoice_res);
        // router.push('/');
    }

    useEffect(() => {
        console.log('router.query.id: ', router.query.id);
        if(router.query.id=='undefined'){
            router.push('/');
        }else{
            setId(router.query.id)
            getInvoiceHandler();
        }
	},[])

    async function handlePrintInvoice(){
        if(!invoice){
            return;
        }

        let company_info = {
            business: {
                name: "Royal Galleria",
                address: "E-303, Street 2, New Iqbal Park, Lahore",
                phone: "+92 3066676417",
                email: "customer.care@royalgalleria.pk",
                email_1: "info@royalgalleria.pk",
                website: "https://royalgalleria.pk/",
            }
        }

        invoice.line_items.forEach(async (element) => {
            let props = await getProps(element);
        });
    }

    const getProps = async (item) => {
        console.log('item: ', item);
        const response = await fetch(`${server}/api/productImage/${item.product_id}`, {
            method:"GET",
            headers:{
                'Content-Type':'application/json',
                'Accept': 'application/json'
            }
        });
        const response_data = await response.json();
        console.log('response_data', response_data);

        const variant_response = await fetch(`${server}/api/productVariant/${item.variant_id}`, {
            method:"GET",
            headers:{
                'Content-Type':'application/json',
                'Accept': 'application/json'
            }
        });
        const variant_data = await variant_response.json();
        console.log('variant_data', variant_data);

        const inventory_response = await fetch(`${server}/api/productInventory/${variant_data.data.inventory_item_id}`, {
            method:"GET",
            headers:{
                'Content-Type':'application/json',
                'Accept': 'application/json'
            }
        });
        const inventory_data = await inventory_response.json();
        console.log('inventory_data', inventory_data);

		let images = response_data.status == 'success' ? response_data.data : [];

        const new_invoice = {
            shipping: {
              name: "Vendor",
              address: item.vendor,
              city: "",
              state: "",
              country: "",
              postal_code: null
            },
            items: [
              {
                item: item.name,
                description: "N/A",
                quantity: item.quantity,
                amount: parseFloat(inventory_data.data.cost) * parseInt(item.quantity)
              }
            ],
            subtotal: parseFloat(inventory_data.data.cost) * parseInt(item.quantity),
            paid: 0,
            invoice_nr: invoice.order_number,
            status:invoice.tags.split(",").pop(),
            image: images.length>0? images[0].src : "https://raw.githubusercontent.com/edisonneza/jspdf-invoice-template/demo/images/logo.png",
            date: dayjs(invoice.created_at).format('DD MMM YYYY')
        };

        const invoice_response = await fetch(`${server}/api/print-invoice`, {
            method:"POST",
            headers:{
                'Content-Type':'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                'invoice': new_invoice,
            })
        });

        console.log('invoice_response', invoice_response);
        console.log('invoice_response', `${server}/invoice.pdf`);

        saveAs(`${server}/invoice.pdf`,
            "invoice.pdf");
        
        return ;
        return {
            outputType: "save",
            returnJsPDFDocObject: true,
            orientationLandscape: false,

            fileName: `Invoice - ${item.name}`,
            logo: {
                src: images.length>0? images[0].src : "https://raw.githubusercontent.com/edisonneza/jspdf-invoice-template/demo/images/logo.png",
                width: 35.33, //aspect ratio = width/height
                height: 35.66,
                margin: {
                    top: 0, //negative or positive num, from the current position
                    left: 0 //negative or positive num, from the current position
                }
            },

            contact: {
                label: "Invoice issued for:",
                name: `Vendor - ${item.vendor}`
                // address: "N/A",
                // phone: "N/A",
                // email: "N/A",
                // otherInfo: "Nothing",
            },
            invoice: {
                label: `Invoice #: ${invoice.order_number}`,
                num: 19,
                invDate: "Invoice Date: " + dayjs(invoice.created_at).format('DD MMM YYYY'),
                invGenDate: "Generated Date: " + dayjs(new Date()).format('DD MMM YYYY'),
                headerBorder: false,
                tableBodyBorder: false,
                header: ["#", "Name", "Quantity", "Description"],
                table: Array.from(Array(1), (i, index)=>([
                    index + 1,
                    item.name,
                    item.quantity,
                    'N/A',
                ])),
                invTotalLabel: "Total:",
                invTotal: (parseFloat(inventory_data.data.cost) * parseInt(item.quantity)).toString(),
                invCurrency: "₹",
                row1: {
                    col1: 'VAT:',
                    col2: '0',
                    col3: '%',
                    style: {
                        fontSize: 10 //optional, default 12
                    }
                },
                row2: {
                    col1: 'SubTotal:',
                    col2: (parseFloat(inventory_data.data.cost) * parseInt(item.quantity)).toString(),
                    col3: '₹',
                    style: {
                        fontSize: 10 //optional, default 12
                    }
                },
                invDescLabel: "Invoice Note",
                invDesc: "This invoice is refered to product vendors. to just maintain the records.",
            },
            footer: {
                text: "The invoice is created on a computer and is valid without the signature and stamp.",
            },
            pageEnable: true,
            pageLabel: "Page ",
        }
    };


    return (
        <>
            <Head>
                <title>Invoice | {invoice && `#${invoice.order_number}`}</title>
            </Head>
        
            <Wrapper>
                <HomeLink/>
                <InvoiceHeader 
                    className="invoice-page-header" 
                    status={invoice?.tags.split(",").pop()} 
                    setPopupIsOpen={setPopupIsOpen}
                    setFormIsOpen={setFormIsOpen}
                    handlePaid={handlePaid}
                    handlePrintInvoice={handlePrintInvoice}
                />
                <AnimatePresence>
                    {invoice && <InvoiceBody invoice={invoice}/>}
                    {/* <InvoiceBody invoice={invoice}/> */}
                </AnimatePresence>
            </Wrapper>
            <InvoiceFooter 
                status={invoice?.tags.split(",").pop()}
                setPopupIsOpen={setPopupIsOpen}
                setFormIsOpen={setFormIsOpen}
                handlePaid={handlePaid}
            />
        </>
    )
}