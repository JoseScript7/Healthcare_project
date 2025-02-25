import cron from 'node-cron';
import { scheduledReportService } from '../services/scheduled-report.service.js';

// Run every hour to check and process scheduled reports
export const startReportScheduler = () => {
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('Processing scheduled reports...');
      await scheduledReportService.processScheduledReports();
    } catch (error) {
      console.error('Report Scheduler Error:', error);
    }
  });
}; 