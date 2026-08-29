import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET must be configured in environment variables.');
  }
  return jwt.sign({ id }, secret, {
    expiresIn: '30d'
  });
};
