import bcrypt from 'bcrypt';
import User from '../models/users/user.js';

const changePassword = async (req, res) => {
  const { newPassword } = req.body;

  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.mustChangePassword = false;
    user.lastPasswordChange = new Date();
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export { changePassword };
