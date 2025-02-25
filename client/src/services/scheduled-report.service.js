import api from './api';

export const scheduledReportService = {
  async createSchedule(scheduleData) {
    try {
      const response = await api.post('/scheduled-reports', scheduleData);
      return response.data;
    } catch (error) {
      console.error('Create Schedule Error:', error);
      throw new Error('Failed to create schedule');
    }
  },

  async getSchedules() {
    try {
      const response = await api.get('/scheduled-reports');
      return response.data;
    } catch (error) {
      console.error('Get Schedules Error:', error);
      throw new Error('Failed to fetch schedules');
    }
  },

  async updateSchedule(scheduleId, data) {
    try {
      const response = await api.put(`/scheduled-reports/${scheduleId}`, data);
      return response.data;
    } catch (error) {
      console.error('Update Schedule Error:', error);
      throw new Error('Failed to update schedule');
    }
  },

  async deleteSchedule(scheduleId) {
    try {
      await api.delete(`/scheduled-reports/${scheduleId}`);
    } catch (error) {
      console.error('Delete Schedule Error:', error);
      throw new Error('Failed to delete schedule');
    }
  }
}; 