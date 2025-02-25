import { loginUser, registerUser } from '../services/auth.service.js';
import { User, Facility } from '../models/index.js';
import bcrypt from 'bcrypt';
import { hashPassword } from '../utils/password.js';
import { ApiError } from '../utils/api-error.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required');
    }

    const result = await loginUser(email, password);
    
    res.json({
      token: result.token,
      user: result.user
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(error.statusCode || 500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
};

export const register = async (req, res) => {
  try {
    const { email, password, role, facility_id } = req.body;
    
    if (!email || !password || !role) {
      return res.status(400).json({ 
        error: 'Email, password, and role are required' 
      });
    }

    const result = await registerUser({ email, password, role, facility_id });
    res.status(201).json(result);
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(400).json({ 
      error: error.message || 'Registration failed' 
    });
  }
};

export const logout = async (req, res) => {
  try {
    if (!req.user?.user_id) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    await User.update(
      { last_login: new Date() },
      { where: { user_id: req.user.user_id } }
    );
    
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout Error:', error);
    res.status(500).json({ 
      error: 'Logout failed' 
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    if (!req.user?.user_id) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await User.findByPk(req.user.user_id, {
      include: [{
        model: Facility,
        attributes: ['facility_id', 'name', 'type', 'location']
      }],
      attributes: { 
        exclude: ['password_hash'] 
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch profile' 
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.user_id);

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await hashPassword(newPassword);
    await user.update({
      password: hashedPassword,
      must_change_password: false
    });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change Password Error:', error);
    res.status(400).json({ error: error.message });
  }
}; 