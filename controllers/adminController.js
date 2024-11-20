import User from "../models/users/user.js";

// Получение всех пользователей
const getAllUsers = async (req, res) => {
  res.json({message:'jjjjj'})
  // try {
  //   const users = await User.findAll();

  //   // Извлекаем только нужные данные
  //   const userData = users.map((user) => user?.dataValues || {});
  //   console.log('User data:', userData);

  //   res.status(200).json(userData); 
  // } catch (error) {
  //   console.error('Error fetching users:', error);
  //   res.status(500).json({ error: 'Internal Server Error' });
  // }
};

const deleteUser = async (req, res) => {
  try {
    console.log('Deleting user with ID:', req.params.id);
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.destroy();
    console.log('User deleted:', user.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export { getAllUsers, deleteUser };
