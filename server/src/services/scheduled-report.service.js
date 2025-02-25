import { ScheduledReport, User } from '../models/index.js';
import { reportService } from './report.service.js';
import { emailService } from './email.service.js';
import { addDays, addWeeks, addMonths, isBefore } from 'date-fns';
import { Op } from 'sequelize';

export const scheduledReportService = {
  async createSchedule(data) {
    const nextRun = this.calculateNextRun(data.frequency);
    return await ScheduledReport.create({
      ...data,
      next_run: nextRun
    });
  },

  async updateSchedule(scheduleId, data) {
    const schedule = await ScheduledReport.findByPk(scheduleId);
    if (!schedule) throw new Error('Schedule not found');

    return await schedule.update(data);
  },

  async deleteSchedule(scheduleId) {
    const schedule = await ScheduledReport.findByPk(scheduleId);
    if (!schedule) throw new Error('Schedule not found');

    await schedule.destroy();
  },

  async getSchedulesByUser(userId) {
    return await ScheduledReport.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']]
    });
  },

  calculateNextRun(frequency, from = new Date()) {
    switch (frequency) {
      case 'daily':
        return addDays(from, 1);
      case 'weekly':
        return addWeeks(from, 1);
      case 'monthly':
        return addMonths(from, 1);
      default:
        throw new Error('Invalid frequency');
    }
  },

  async processScheduledReports() {
    const dueReports = await ScheduledReport.findAll({
      where: {
        is_active: true,
        next_run: {
          [Op.lte]: new Date()
        }
      }
    });

    for (const schedule of dueReports) {
      try {
        // Generate report
        const report = await this.generateScheduledReport(schedule);

        // Send email with report
        await this.sendReportEmail(schedule, report);

        // Update schedule
        await schedule.update({
          last_run: new Date(),
          next_run: this.calculateNextRun(schedule.frequency)
        });
      } catch (error) {
        console.error(`Failed to process scheduled report ${schedule.schedule_id}:`, error);
      }
    }
  },

  async generateScheduledReport(schedule) {
    switch (schedule.report_type) {
      case 'inventory':
        return await reportService.generateInventoryReport(
          schedule.facility_id,
          schedule.format
        );
      case 'transaction':
        return await reportService.generateTransactionReport(
          schedule.facility_id,
          schedule.parameters.startDate,
          schedule.parameters.endDate
        );
      // Add other report types as needed
      default:
        throw new Error('Invalid report type');
    }
  },

  async sendReportEmail(schedule, reportBuffer) {
    const user = await User.findByPk(schedule.user_id);
    
    const recipients = [...schedule.recipients];
    if (!recipients.includes(user.email)) {
      recipients.push(user.email);
    }

    const filename = `${schedule.report_type}-report.${schedule.format}`;
    
    await emailService.sendEmail({
      to: recipients,
      subject: `Scheduled Report: ${schedule.report_type}`,
      text: `Your scheduled ${schedule.report_type} report is attached.`,
      attachments: [{
        filename,
        content: reportBuffer
      }]
    });
  }
}; 