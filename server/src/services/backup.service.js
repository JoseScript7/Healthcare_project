import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

export const backupService = {
  async createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(process.cwd(), 'backups', `backup-${timestamp}.sql`);
    
    const command = `pg_dump -U ${process.env.DB_USER} -h ${process.env.DB_HOST} ${process.env.DB_NAME} > ${backupPath}`;
    
    try {
      await execAsync(command);
      console.log(`Backup created at ${backupPath}`);
    } catch (error) {
      console.error('Backup failed:', error);
      throw error;
    }
  }
}; 