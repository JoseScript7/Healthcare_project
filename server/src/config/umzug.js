import { Umzug, SequelizeStorage } from 'umzug';
import sequelize from './database.js';

export const migrator = new Umzug({
  migrations: { glob: 'src/migrations/*.js' },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

export const runMigrations = async () => {
  await migrator.up();
  console.log('Migrations completed');
}; 