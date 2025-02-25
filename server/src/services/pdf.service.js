import PDFDocument from 'pdfkit';
import { format } from 'date-fns';

export const generateInventoryReport = async (data, facilityName) => {
  const doc = new PDFDocument();
  const buffers = [];

  // Collect PDF data chunks
  doc.on('data', buffer => buffers.push(buffer));

  // Header
  doc.fontSize(20)
    .text('Inventory Report', { align: 'center' })
    .fontSize(14)
    .text(`Facility: ${facilityName}`, { align: 'center' })
    .text(`Generated: ${format(new Date(), 'PPP')}`, { align: 'center' })
    .moveDown(2);

  // Stock Summary
  doc.fontSize(16)
    .text('Current Stock Summary', { underline: true })
    .moveDown();

  data.stock.forEach(item => {
    doc.fontSize(12)
      .text(`${item.InventoryItem.name}`)
      .text(`Quantity: ${item.quantity}`)
      .text(`Category: ${item.InventoryItem.category}`)
      .moveDown();
  });

  // Low Stock Items
  doc.addPage()
    .fontSize(16)
    .text('Low Stock Items', { underline: true })
    .moveDown();

  data.lowStock.forEach(item => {
    doc.fontSize(12)
      .text(`${item.InventoryItem.name}`)
      .text(`Current Quantity: ${item.quantity}`)
      .text(`Minimum Required: ${item.minimum_quantity}`)
      .moveDown();
  });

  // Expiring Items
  doc.addPage()
    .fontSize(16)
    .text('Expiring Items', { underline: true })
    .moveDown();

  data.expiringItems.forEach(item => {
    doc.fontSize(12)
      .text(`${item.InventoryItem.name}`)
      .text(`Expiry Date: ${format(new Date(item.expiry_date), 'PPP')}`)
      .text(`Quantity: ${item.quantity}`)
      .moveDown();
  });

  // Stock Movements
  doc.addPage()
    .fontSize(16)
    .text('Recent Stock Movements', { underline: true })
    .moveDown();

  data.movements.forEach(movement => {
    doc.fontSize(12)
      .text(`Item: ${movement.InventoryItem.name}`)
      .text(`Quantity: ${movement.quantity}`)
      .text(`Date: ${format(new Date(movement.created_at), 'PPP')}`)
      .text(`From: ${movement.FromFacility.name}`)
      .text(`To: ${movement.ToFacility.name}`)
      .moveDown();
  });

  // Finalize PDF
  doc.end();

  return new Promise((resolve) => {
    doc.on('end', () => {
      resolve(Buffer.concat(buffers));
    });
  });
}; 