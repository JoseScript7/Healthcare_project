import {
  createTransfer,
  approveTransfer,
  completeTransfer,
  getTransfersByFacility
} from '../services/transfer.service.js';

export const createTransferRequest = async (req, res) => {
  try {
    const transferData = {
      ...req.body,
      requested_by: req.user.user_id,
      status: 'pending'
    };

    const transfer = await createTransfer(transferData);
    res.status(201).json(transfer);
  } catch (error) {
    console.error('Create Transfer Error:', error);
    res.status(400).json({ error: error.message });
  }
};

export const approveTransferRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const transfer = await approveTransfer(id, req.user.user_id);
    res.json(transfer);
  } catch (error) {
    console.error('Approve Transfer Error:', error);
    res.status(400).json({ error: error.message });
  }
};

export const completeTransferRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const transfer = await completeTransfer(id);
    res.json(transfer);
  } catch (error) {
    console.error('Complete Transfer Error:', error);
    res.status(400).json({ error: error.message });
  }
};

export const getFacilityTransfers = async (req, res) => {
  try {
    const { facility_id } = req.user;
    const transfers = await getTransfersByFacility(facility_id);
    res.json(transfers);
  } catch (error) {
    console.error('Get Transfers Error:', error);
    res.status(500).json({ error: 'Failed to fetch transfers' });
  }
}; 