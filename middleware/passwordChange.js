import User from '../models/users/user.js';

async function checkMustChangePassword(req, res, next) {
  const user = await User.findByPk(req.user.id);

  // Проверяем, истекло ли 7 дней с момента последней смены пароля
  const passwordAge = Math.floor(
    (Date.now() - new Date(user.lastPasswordChange)) / (1000 * 60 * 60 * 24)
  );
  if (passwordAge >= 30 || user.mustChangePassword) {
    return res.status(403).json({ error: 'You must change your password' });
  }

  next();
}

export default checkMustChangePassword;
