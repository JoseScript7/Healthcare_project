import { Transfer, Stock, User, Facility, InventoryItem } from '../models/index.js';
import { createNotification } from './notification.service.js';
import { sequelize } from '../config/database.js';
import { Op } from 'sequelize';
import TransferHistory from '../models/transfer-history.model.js';

export const createTransfer = async (data) => {
  const transaction = await sequelize.transaction();

  try {
    // Check source facility stock
    const sourceStock = await Stock.findOne({
      where: {
        facility_id: data.from_facility_id,
        item_id: data.item_id
      },
      transaction
    });

    if (!sourceStock || sourceStock.quantity < data.quantity) {
      throw new Error('Insufficient stock for transfer');
    }

    // Create transfer request
    const transfer = await Transfer.create(data, { transaction });

    // Create initial history entry
    await createTransferHistory(
      transfer.transfer_id,
      'pending',
      data.requested_by,
      data.notes,
      transaction
    );

    // Notify receiving facility managers
    const managers = await User.findAll({
      where: {
        facility_id: data.to_facility_id,
        role: 'manager'
      }
    });

    // Create notifications for each manager
    await Promise.all(managers.map(manager =>
      createNotification({
        user_id: manager.user_id,
        title: 'New Transfer Request',
        message: `Transfer request for ${data.quantity} units from ${data.from_facility_name}`,
        type: 'transfer',
        reference_id: transfer.transfer_id,
        reference_type: 'transfer'
      })
    ));

    await transaction.commit();
    return transfer;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const approveTransfer = async (transferId, approverId, notes = null) => {
  const transaction = await sequelize.transaction();

  try {
    const transfer = await Transfer.findByPk(transferId, { transaction });
    if (!transfer) throw new Error('Transfer not found');

    if (transfer.status !== 'pending') {
      throw new Error('Transfer cannot be approved');
    }

    // Update transfer status
    await transfer.update({
      status: 'approved',
      approved_by: approverId
    }, { transaction });

    // Create history entry
    await createTransferHistory(
      transferId,
      'approved',
      approverId,
      notes,
      transaction
    );

    // Create notification for requester
    await createNotification({
      user_id: transfer.requested_by,
      title: 'Transfer Approved',
      message: `Your transfer request has been approved`,
      type: 'transfer',
      reference_id: transfer.transfer_id,
      reference_type: 'transfer'
    });

    await transaction.commit();
    return transfer;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const completeTransfer = async (transferId) => {
  const transaction = await sequelize.transaction();

  try {
    const transfer = await Transfer.findByPk(transferId, {
      include: [
        { model: Facility, as: 'FromFacility' },
        { model: Facility, as: 'ToFacility' },
        { model: InventoryItem }
      ],
      transaction
    });

    if (!transfer || transfer.status !== 'approved') {
      throw new Error('Transfer cannot be completed');
    }

    // Update source facility stock
    await Stock.decrement(
      { quantity: transfer.quantity },
      {
        where: {
          facility_id: transfer.from_facility_id,
          item_id: transfer.item_id
        },
        transaction
      }
    );

    // Update or create destination facility stock
    await Stock.upsert({
      facility_id: transfer.to_facility_id,
      item_id: transfer.item_id,
      quantity: transfer.quantity
    }, { transaction });

    // Update transfer status
    await transfer.update({ status: 'completed' }, { transaction });

    await transaction.commit();
    return transfer;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const getTransfersByFacility = async (facilityId) => {
  return await Transfer.findAll({
    where: {
      [Op.or]: [
        { from_facility_id: facilityId },
        { to_facility_id: facilityId }
      ]
    },
    include: [
      { model: Facility, as: 'FromFacility' },
      { model: Facility, as: 'ToFacility' },
      { model: InventoryItem },
      { 
        model: User, 
        as: 'Requester',
        attributes: ['user_id', 'name', 'email']
      }
    ],
    order: [['created_at', 'DESC']]
  });
};

const createTransferHistory = async (transferId, status, userId, notes = null, transaction) => {
  await TransferHistory.create({
    transfer_id: transferId,
    status,
    action_by: userId,
    notes
  }, { transaction });
};

export const getTransferHistory = async (transferId) => {
  return await TransferHistory.findAll({
    where: { transfer_id: transferId },
    include: [
      {
        model: User,
        as: 'ActionBy',
        attributes: ['user_id', 'name', 'email']
      }
    ],
    order: [['created_at', 'DESC']]
  });
}; 