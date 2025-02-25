import api from './api';

export const reportService = {
  async generateInventoryReport(format = 'excel') {
    try {
      const response = await api.get(`/reports/inventory?format=${format}`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], {
        type: format === 'excel'
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'application/pdf'
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `inventory-report.${format === 'excel' ? 'xlsx' : 'pdf'}`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Generate Report Error:', error);
      throw new Error('Failed to generate report');
    }
  },

  async generateTransactionReport(startDate, endDate) {
    try {
      const response = await api.get('/reports/transactions', {
        params: { startDate, endDate },
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'transaction-report.xlsx';
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Generate Transaction Report Error:', error);
      throw new Error('Failed to generate transaction report');
    }
  },

  async downloadInventoryReport(format = 'excel') {
    try {
      const response = await api.get(`/reports/inventory?format=${format}`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], {
        type: format === 'excel' 
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'application/pdf'
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `inventory-report.${format}`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download Report Error:', error);
      throw new Error('Failed to download report');
    }
  }
};

export const downloadInventoryReport = reportService.downloadInventoryReport; 