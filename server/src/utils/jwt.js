import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  return jwt.sign(
    { 
      user_id: user.user_id,
      email: user.email,
      role: user.role,
      facility_id: user.facility_id 
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}; 