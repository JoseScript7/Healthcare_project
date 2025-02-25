import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST']
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.user.user_id);
    
    socket.join(`facility_${socket.user.facility_id}`);
    
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.user.user_id);
    });
  });
};

export const emitTransferUpdate = (transfer) => {
  if (!io) return;

  // Emit to both source and destination facilities
  io.to(`facility_${transfer.from_facility_id}`)
    .to(`facility_${transfer.to_facility_id}`)
    .emit('transfer_update', transfer);
};

export const emitStockUpdate = (facilityId, stockUpdate) => {
  if (!io) return;
  
  io.to(`facility_${facilityId}`).emit('stock_update', stockUpdate);
}; 