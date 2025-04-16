import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Hardcoded admin user for testing
const adminUser = {
  id: 1,
  username: 'admin',
  password: 'admin123',
  role: 'admin'
};

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if credentials match admin user
  if (username === adminUser.username && password === adminUser.password) {
    const token = jwt.sign(
      { 
        userId: adminUser.id, 
        username: adminUser.username, 
        role: adminUser.role 
      },
      'your-secret-key',
      { expiresIn: '1h' }
    );

    return res.json({
      success: true,
      token,
      user: {
        username: adminUser.username,
        role: adminUser.role
      }
    });
  }

  return res.status(401).json({ 
    success: false, 
    message: 'Invalid credentials' 
  });
});

export default router; 