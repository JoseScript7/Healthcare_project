import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { Stock, InventoryItem, Facility, Transaction } from '../models/index.js';
import { Op } from 'sequelize';
import { format } from 'date-fns';

export const reportService = {
  async generateInventoryReport(facilityId, format = 'excel') {
    const inventory = await Stock.findAll({
      where: { facility_id: facilityId },
      include: [
        { model: InventoryItem },
        { model: Facility }
      ]
    });

    return format === 'excel' 
      ? this.generateExcelReport(inventory)
      : this.generatePDFReport(inventory);
  },

  async generateExcelReport(data) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Inventory Report');

    // Add headers
    worksheet.columns = [
      { header: 'Item Name', key: 'name', width: 30 },
      { header: 'SKU', key: 'sku', width: 15 },
      { header: 'Category', key: 'category', width: 15 },
      { header: 'Quantity', key: 'quantity', width: 10 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Expiry Date', key: 'expiry', width: 15 },
      { header: 'Facility', key: 'facility', width: 20 }
    ];

    // Add data
    data.forEach(item => {
      worksheet.addRow({
        name: item.InventoryItem.name,
        sku: item.InventoryItem.sku,
        category: item.InventoryItem.category,
        quantity: item.quantity,
        status: item.status,
        expiry: item.expiry_date ? format(new Date(item.expiry_date), 'yyyy-MM-dd') : 'N/A',
        facility: item.Facility.name
      });
    });

    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  },

  async generatePDFReport(data) {
    const doc = new PDFDocument();
    const buffers = [];

    doc.on('data', buffer => buffers.push(buffer));
    doc.on('end', () => Buffer.concat(buffers));

    // Add title
    doc.fontSize(20).text('Inventory Report', { align: 'center' });
    doc.moveDown();

    // Add date
    doc.fontSize(12).text(`Generated on: ${format(new Date(), 'yyyy-MM-dd HH:mm')}`, { align: 'right' });
    doc.moveDown();

    // Add table headers
    const tableTop = 150;
    const itemsPerPage = 20;
    let currentPage = 1;
    let yPosition = tableTop;

    const addTableHeader = () => {
      doc.fontSize(10)
         .text('Item Name', 50, yPosition)
         .text('SKU', 200, yPosition)
         .text('Quantity', 300, yPosition)
         .text('Status', 380, yPosition)
         .text('Expiry', 460, yPosition);
      
      yPosition += 20;
      doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke();
      yPosition += 10;
    };

    addTableHeader();

    // Add data
    data.forEach((item, index) => {
      if (yPosition > 700) {
        doc.addPage();
        yPosition = tableTop;
        addTableHeader();
      }

      doc.fontSize(10)
         .text(item.InventoryItem.name, 50, yPosition)
         .text(item.InventoryItem.sku, 200, yPosition)
         .text(item.quantity.toString(), 300, yPosition)
         .text(item.status, 380, yPosition)
         .text(item.expiry_date ? format(new Date(item.expiry_date), 'yyyy-MM-dd') : 'N/A', 460, yPosition);

      yPosition += 20;
    });

    doc.end();
    return Buffer.concat(buffers);
  },

  async generateTransactionReport(facilityId, startDate, endDate) {
    const transactions = await Transaction.findAll({
      where: {
        facility_id: facilityId,
        created_at: {
          [Op.between]: [startDate, endDate]
        }
      },
      include: [
        { model: InventoryItem },
        { model: Facility }
      ],
      order: [['created_at', 'DESC']]
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Transaction Report');

    // Add headers and data similar to inventory report
    // ... implementation similar to inventory report

    return workbook.xlsx.writeBuffer();
  }
}; 