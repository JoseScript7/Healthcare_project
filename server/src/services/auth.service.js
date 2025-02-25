import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, Facility } from '../models/index.js';
import { generateToken } from '../utils/jwt.js';
import { ApiError } from '../utils/api-error.js';

export const loginUser = async (email, password) => {
  try {
    console.log('Attempting login for:', email);

    // Find user
    const user = await User.findOne({ 
      where: { email },
      include: [{
        model: Facility,
        attributes: ['facility_id', 'name', 'type']
      }]
    });

    if (!user) {
      console.log('User not found:', email);
      throw new ApiError(401, 'Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      console.log('Invalid password for:', email);
      throw new ApiError(401, 'Invalid credentials');
    }

    // Generate token
    const token = generateToken(user);

    // Update last login
    await user.update({ last_login: new Date() });

    console.log('Login successful for:', email);

    return {
      token,
      user: {
        user_id: user.user_id,
        email: user.email,
        name: user.name,
        role: user.role,
        facility_id: user.facility_id,
        facility: user.Facility
      }
    };
  } catch (error) {
    console.error('Login Error:', error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  const { email, password, role, facility_id } = userData;

  if (!email || !password || !role) {
    throw new Error('Missing required fields');
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('Email already registered');
  }

  // Validate role
  const validRoles = ['admin', 'staff', 'manager'];
  if (!validRoles.includes(role)) {
    throw new Error('Invalid role specified');
  }

  // If facility_id is provided, verify it exists
  if (facility_id) {
    const facility = await Facility.findByPk(facility_id);
    if (!facility) {
      throw new Error('Invalid facility specified');
    }
  }

  const password_hash = await bcrypt.hash(password, 10);
  
  const user = await User.create({
    email,
    password_hash,
    role,
    facility_id,
    created_at: new Date()
  });

  const token = generateToken(user);
  
  return {
    token,
    user: {
      id: user.user_id,
      email: user.email,
      role: user.role,
      facility_id: user.facility_id
    }
  };
}; 