import { User, Facility, InventoryItem } from '../models/index.js';
import bcrypt from 'bcrypt';

export const seedInitialData = async () => {
  try {
    // Create initial facility
    const facility = await Facility.create({
      name: 'Main Hospital',
      type: 'hospital',
      location: 'New York',
      status: 'active'
    });

    // Create admin user with password_hash
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      email: 'admin@example.com',
      password_hash: hashedPassword,
      role: 'admin',
      facility_id: facility.facility_id
    });

    // Create some initial inventory items
    const items = await InventoryItem.bulkCreate([
      {
        name: 'Surgical Masks',
        category: 'PPE',
        description: 'Disposable surgical masks',
        unit: 'box'
      },
      {
        name: 'Hand Sanitizer',
        category: 'Hygiene',
        description: '500ml hand sanitizer bottles',
        unit: 'bottle'
      },
      {
        name: 'Paracetamol',
        category: 'Medicine',
        description: '500mg tablets',
        unit: 'pack'
      }
    ]);

    console.log('Initial seed data created successfully');
    return { facility, items };
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  }
}; 