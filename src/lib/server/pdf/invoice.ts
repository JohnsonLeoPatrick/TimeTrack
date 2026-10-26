import PDFDocument from 'pdfkit';

interface InvoiceData {
  invoiceNumber: string;
  eventName: string;
  billingName: string;
  billingEmail: string;
  billingPhone: string;
  items: { name: string; price: number; quantity: number }[];
  totalAmount: number;
  discountAmount: number;
  netAmount: number;
  date: string;
}

export async function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Brand header
    doc.rect(0, 0, doc.page.width, 80).fill('#ccff00');
    doc.fillColor('#000').fontSize(28).font('Helvetica-Bold')
      .text('TIME TRACK', 40, 24);
    doc.fontSize(10).font('Helvetica')
      .text('INVOICE', 40, 56);
    doc.fillColor('#000').fontSize(10)
      .text('Every Second Counts', doc.page.width - 200, 24, { width: 160, align: 'right' });

    // Invoice details
    doc.fillColor('#fff').fontSize(10).font('Helvetica');
    const detailsY = 100;
    doc.fillColor('#666').text('Invoice Number:', 40, detailsY);
    doc.fillColor('#000').text(data.invoiceNumber, 160, detailsY);
    doc.fillColor('#666').text('Date:', 40, detailsY + 18);
    doc.fillColor('#000').text(data.date, 160, detailsY + 18);

    // Billing info
    const billingX = doc.page.width - 200;
    doc.fillColor('#666').text('Bill To:', billingX, detailsY);
    doc.fillColor('#000').text(data.billingName, billingX, detailsY + 18);
    doc.fillColor('#000').text(data.billingEmail, billingX, detailsY + 36);
    doc.fillColor('#000').text(data.billingPhone, billingX, detailsY + 54);

    // Items table
    const tableY = 200;
    doc.rect(40, tableY, doc.page.width - 80, 20).fill('#f5f5f5');
    doc.fillColor('#000').fontSize(10).font('Helvetica-Bold');
    doc.text('Item', 50, tableY + 5);
    doc.text('Qty', 350, tableY + 5, { width: 50, align: 'center' });
    doc.text('Price', 420, tableY + 5, { width: 80, align: 'right' });

    let rowY = tableY + 25;
    doc.font('Helvetica').fontSize(10);
    for (const item of data.items) {
      doc.fillColor('#000').text(item.name, 50, rowY);
      doc.text(String(item.quantity), 350, rowY, { width: 50, align: 'center' });
      doc.text(`RM ${item.price.toFixed(2)}`, 420, rowY, { width: 80, align: 'right' });
      rowY += 18;
    }

    // Totals
    rowY += 10;
    doc.rect(300, rowY, doc.page.width - 340, 80).fill('#f5f5f5').stroke('#ddd');
    doc.fillColor('#000').font('Helvetica');
    doc.text('Subtotal:', 310, rowY + 8);
    doc.text(`RM ${data.totalAmount.toFixed(2)}`, 440, rowY + 8, { width: 80, align: 'right' });

    if (data.discountAmount > 0) {
      doc.text('Discount:', 310, rowY + 28);
      doc.fillColor('#ccff00').text(`-RM ${data.discountAmount.toFixed(2)}`, 440, rowY + 28, { width: 80, align: 'right' });
    }

    doc.font('Helvetica-Bold');
    doc.fillColor('#000').text('TOTAL:', 310, rowY + 52);
    doc.text(`RM ${data.netAmount.toFixed(2)}`, 440, rowY + 52, { width: 80, align: 'right' });

    // Footer
    doc.fontSize(8).fillColor('#999').font('Helvetica');
    doc.text('Thank you for your registration!', 40, doc.page.height - 60);
    doc.text('Time Track | www.timetrack.asia', 40, doc.page.height - 45);
    doc.text(`Invoice #${data.invoiceNumber}`, 40, doc.page.height - 30);

    doc.end();
  });
}
