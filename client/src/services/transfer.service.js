import api from './api';

export const transferService = {
  async createTransfer(transferData) {
    try {
      const response = await api.post('/transfers', transferData);
      return response.data;
    } catch (error) {
      console.error('Create Transfer Error:', error);
      throw new Error(error.response?.data?.error || 'Failed to create transfer');
    }
  },

  async getTransfers() {
    try {
      const response = await api.get('/transfers');
      return response.data;
    } catch (error) {
      console.error('Get Transfers Error:', error);
      throw new Error('Failed to fetch transfers');
    }
  },

  async approveTransfer(transferId) {
    try {
      const response = await api.put(`/transfers/${transferId}/approve`);
      return response.data;
    } catch (error) {
      console.error('Approve Transfer Error:', error);
      throw new Error('Failed to approve transfer');
    }
  },

  async completeTransfer(transferId) {
    try {
      const response = await api.put(`/transfers/${transferId}/complete`);
      return response.data;
    } catch (error) {
      console.error('Complete Transfer Error:', error);
      throw new Error('Failed to complete transfer');
    }
  },

  async getTransferHistory(transferId) {
    try {
      const response = await api.get(`/transfers/${transferId}/history`);
      return response.data;
    } catch (error) {
      console.error('Get Transfer History Error:', error);
      throw new Error('Failed to fetch transfer history');
    }
  },

  async initiateTransfer(transferData) {
    try {
      const response = await api.post('/transfers', transferData);
      return response.data;
    } catch (error) {
      console.error('Transfer Initiation Error:', error);
      throw new Error('Failed to initiate transfer');
    }
  }
};

export const initiateTransfer = transferService.initiateTransfer; 