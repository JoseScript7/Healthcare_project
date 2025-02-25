import {
  getFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility
} from '../services/facility.service.js';
import { User } from '../models/index.js';
import { generateTempPassword, hashPassword } from '../utils/password.js';
import { sendWelcomeEmail } from '../services/email.service.js';

export const getAllFacilities = async (req, res) => {
  try {
    const facilities = await getFacilities(req.query);
    res.status(200).json(facilities);
  } catch (error) {
    console.error('Get Facilities Error:', error);
    res.status(500).json({ error: 'Failed to fetch facilities' });
  }
};

export const getFacility = async (req, res) => {
  try {
    const facility = await getFacilityById(req.params.id);
    res.status(200).json(facility);
  } catch (error) {
    console.error('Get Facility Error:', error);
    res.status(404).json({ error: error.message });
  }
};

export const addFacility = async (req, res) => {
  try {
    const facility = await createFacility(req.body);
    res.status(201).json(facility);
  } catch (error) {
    console.error('Add Facility Error:', error);
    res.status(400).json({ error: error.message });
  }
};

export const updateFacilityDetails = async (req, res) => {
  try {
    const facility = await updateFacility(req.params.id, req.body);
    res.status(200).json(facility);
  } catch (error) {
    console.error('Update Facility Error:', error);
    res.status(400).json({ error: error.message });
  }
};

export const removeFacility = async (req, res) => {
  try {
    await deleteFacility(req.params.id);
    res.status(200).json({ message: 'Facility deleted successfully' });
  } catch (error) {
    console.error('Delete Facility Error:', error);
    res.status(400).json({ error: error.message });
  }
};

export const getFacilityUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { facility_id: req.params.id },
      attributes: ['user_id', 'name', 'email', 'role']
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('Get Facility Users Error:', error);
    res.status(500).json({ error: 'Failed to fetch facility users' });
  }
};

export const addFacilityUser = async (req, res) => {
  try {
    const { email, role, name } = req.body;
    const tempPassword = generateTempPassword();
    const hashedPassword = await hashPassword(tempPassword);

    const user = await User.create({
      email,
      role,
      name,
      facility_id: req.params.id,
      password: hashedPassword,
      must_change_password: true
    });

    // Send welcome email with temporary password
    await sendWelcomeEmail(user, tempPassword);

    // Don't send the password back in the response
    const { password, ...userWithoutPassword } = user.toJSON();
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Add Facility User Error:', error);
    res.status(400).json({ error: error.message });
  }
};

export const removeFacilityUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        user_id: req.params.userId,
        facility_id: req.params.id
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();
    res.status(200).json({ message: 'User removed successfully' });
  } catch (error) {
    console.error('Remove Facility User Error:', error);
    res.status(400).json({ error: error.message });
  }
}; 