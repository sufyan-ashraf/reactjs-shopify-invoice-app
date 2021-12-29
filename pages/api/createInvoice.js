const fs = require("fs");
const PDFDocument = require("pdfkit");
import axios from 'axios';
import Logo from '../../components/shared/Logo';
import { server } from '../../config';

async function createInvoice(invoice, path) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });

  await generateHeader(doc);
  generateCustomerInformation(doc, invoice);
  await generateInvoiceTable(doc, invoice);
  generateFooter(doc);
  console.log('0000000');
  doc.end();
  doc.pipe(fs.createWriteStream(path));
}

const fetchImage = async (src) => {
    return axios.get(src, {responseType: 'arraybuffer'}).then( response => {
      const pngBuffer = Buffer.from(response.data);
      console.log('11111');
      return pngBuffer;
  });
};


async function generateHeader(doc) {
  const logo = await fetchImage("https://cdn.shopify.com/s/files/1/0558/5181/0966/files/Royal-logo_6c75995b-e0c0-4bf3-be21-65ea21f53303.png?v=1619296465");
  console.log('2222');
  // doc.end();
  doc
    .image(logo, 50, 45, { width: 50 })
    .fillColor("#444444")
    .fontSize(20)
    .text("Royal Galleria", 110, 57)
    .fontSize(10)
    .text("Royal Galleria", 200, 50, { align: "right" })
    .text("E-303, Street 2, New Iqbal Park, Lahore", 200, 65, { align: "right" })
    .text("+92 3066676417", 200, 80, { align: "right" })
    .text("customer.care@royalgalleria.pk", 200, 95, { align: "right" })
    .moveDown();
}

function generateCustomerInformation(doc, invoice) {
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text("Invoice", 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text("Invoice Number:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(invoice.invoice_nr, 150, customerInformationTop)
    .font("Helvetica")
    .text("Invoice Date:", 50, customerInformationTop + 15)
    .text(invoice.date, 150, customerInformationTop + 15)
    .text("Status:", 50, customerInformationTop + 30)
    .text(
      invoice.status?invoice.status:'N/A',
      150,
      customerInformationTop + 30
    )

    .font("Helvetica-Bold")
    .text(invoice.shipping.name, 300, customerInformationTop)
    .font("Helvetica")
    .text(invoice.shipping.address, 300, customerInformationTop + 15)
    .text(
      invoice.shipping.city +
        ", " +
        invoice.shipping.state +
        ", " +
        invoice.shipping.country,
      300,
      customerInformationTop + 30
    )
    .moveDown();

  generateHr(doc, 252);
}

async function generateInvoiceTable(doc, invoice) {
  let i;
  const invoiceTableTop = 330;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Item",
    "Description",
    "Unit Cost",
    "Quantity",
    "Line Total"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.item,
      item.description,
      formatCurrency(item.amount / item.quantity),
      item.quantity,
      formatCurrency(item.amount)
    );

    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "Subtotal",
    "",
    formatCurrency(invoice.subtotal)
  );

  const image = await fetchImage(invoice.image);
  doc.image(image, 100, subtotalPosition + 100, { width: 300 })
}

function generateFooter(doc) {
  doc
    .fontSize(10)
    .text(
      "This invoice is refered to product vendors. to just maintain the records.",
      50,
      768,
      { align: "center", width: 500 }
    )
    .text(
      `Invoice Generated Date: ${formatDate(new Date())}`,
      50,
      780,
      { align: "center", width: 500 }
    );
  }

function generateTableRow(
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal
) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 220, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(quantity, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function formatCurrency(cents) {
  return "PKR" + (cents / 100).toFixed(2);
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + "/" + month + "/" + day;
}

module.exports = {
  createInvoice
};
