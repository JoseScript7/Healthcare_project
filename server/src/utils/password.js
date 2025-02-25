import crypto from 'crypto';
import bcrypt from 'bcrypt';

export const generateTempPassword = () => {
  // Generate a random 10 character password
  const tempPassword = crypto.randomBytes(5).toString('hex');
  return tempPassword;
};

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}; 