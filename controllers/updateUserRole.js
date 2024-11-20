import User from "../models/users/user.js";

const updateUserRole = async (req, res) => {
  const { userId, newRole } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.role === 'superAdmin' && newRole !== 'superAdmin') {
      return res
        .status(403)
        .json({ error: 'Cannot change role of superAdmin' });
    }

    user.role = newRole;
    user.mustChangePassword = true;
    await user.save();

    res.status(200).json({ message: 'Role updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export { updateUserRole };
