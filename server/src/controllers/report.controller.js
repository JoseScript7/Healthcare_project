import { reportService } from '../services/report.service.js';

export const generateInventoryReport = async (req, res) => {
  try {
    const { facility_id } = req.user;
    const { format = 'excel' } = req.query;

    const report = await reportService.generateInventoryReport(facility_id, format);

    res.setHeader('Content-Type', format === 'excel' 
      ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      : 'application/pdf'
    );
    
    res.setHeader('Content-Disposition', `attachment; filename=inventory-report.${format === 'excel' ? 'xlsx' : 'pdf'}`);
    res.send(report);
  } catch (error) {
    console.error('Report Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
};

export const generateTransactionReport = async (req, res) => {
  try {
    const { facility_id } = req.user;
    const { startDate, endDate } = req.query;

    const report = await reportService.generateTransactionReport(
      facility_id,
      new Date(startDate),
      new Date(endDate)
    );

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=transaction-report.xlsx');
    res.send(report);
  } catch (error) {
    console.error('Transaction Report Error:', error);
    res.status(500).json({ error: 'Failed to generate transaction report' });
  }
}; 