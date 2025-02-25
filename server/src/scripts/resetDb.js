import sequelize from '../config/database.js';
import { seedInitialData } from '../seeds/initial.js';

async function resetDatabase() {
  try {
    console.log('Dropping all tables...');
    await sequelize.drop();
    
    console.log('Syncing database...');
    await sequelize.sync({ force: true });
    
    console.log('Seeding initial data...');
    await seedInitialData();
    
    console.log('Database reset and seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  }
}

resetDatabase(); 