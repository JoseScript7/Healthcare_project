import { spawn } from 'child_process';
import path from 'path';

// Start Python ML service
const mlService = spawn('python', ['ml/service.py'], {
  stdio: 'inherit'
});

// Start Node.js server
const nodeServer = spawn('node', ['src/app.js'], {
  stdio: 'inherit'
});

process.on('SIGINT', () => {
  mlService.kill();
  nodeServer.kill();
  process.exit();
}); 