import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/users/user.js';
import BlacklistedToken from '../models/users/logout.js';
import validator from 'validator';
import { Op } from 'sequelize';
// Регистрация
const register = async (req, res) => {
  const { userName, fullName, email, password } = req.body;
  console.log(req.body);
  try {
    if (req.body.role === 'superAdmin') {
      return res
        .status(403)
        .json({ error: 'Cannot register as superAdmin through API' });
    }

    if (!userName || !fullName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Проверяем уникальность username и email
    const existingUser = await User.findOne({
      where: { [Op.or]: [{ email }, { userName }] },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: 'Email or username already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      userName: userName,
      fullName: fullName,
      email: email,
      password: hashedPassword,
      role: req.body.role || 'user',
      mustChangePassword: false,
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Вход
const login = async (req, res) => {
  const { loginInput, password } = req.body;

  try {
    // Проверяем, что оба поля переданы
    if (!loginInput || !password) {
      return res
        .status(400)
        .json({ error: 'Login (email or username) and password are required' });
    }

    let user;
    // Проверяем, является ли введенный loginInput email или username
    if (validator.isEmail(loginInput)) {
      user = await User.findOne({ where: { email: loginInput } });
    } else {
      user = await User.findOne({ where: { userName: loginInput } });
    }

    // Если пользователь не найден
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Генерируем токен
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        userName: user.userName,
        role: user.role || 'user',
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Удаление аккаунта
const deleteAccount = async (req, res) => {
  try {
   
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token is missing' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    //  в базе
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.destroy();

    // из BlacklistedTokens
    await BlacklistedToken.destroy({
      where: { userId },
    });

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Смена email
const changeEmail = async (req, res) => {
  const { newEmail } = req.body;
  console.log(req.res);
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const existingUser = await User.findOne({ where: { email: newEmail } });
    if (existingUser)
      return res.status(400).json({ error: 'Email already in use' });

    user.email = newEmail;
    await user.save();
    res.status(200).json({ message: 'Email changed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Выход из системы
const logout = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Извлечение токена
  if (!token) return res.status(400).json({ error: 'Token is missing' });

  try {
    // Проверка подписи
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { id: userId, exp } = decoded; 

    // Добавление токена в Blacklist
    await BlacklistedToken.create({
      token,
      expiresAt: new Date(exp * 1000), // Срок действия
      userId,
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export { register, login, deleteAccount, changeEmail, logout };
