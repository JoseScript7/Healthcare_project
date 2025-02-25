import { seedInitialData } from '../seeds/initial.js';
import { initializeDatabase } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const runSeeds = async () => {
  try {
    await initializeDatabase();
    await seedInitialData();
    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

runSeeds(); 