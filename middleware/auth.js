import jwt from 'jsonwebtoken';
import BlacklistedToken from '../models/users/logout.js';
async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const blacklisted = await BlacklistedToken.findOne({ where: { token } });
    if (blacklisted) {
      return res.status(403).json({ error: 'Token is blacklisted' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    if (decoded.exp * 1000 < Date.now()) {
      return res.status(403).json({ error: 'Token is expired' });
    }

    req.user = decoded; // Передаем данные пользователя
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(403).json({ error: 'Invalid or expired token' });
  }
}

export default authenticate;
