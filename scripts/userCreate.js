import bcrypt from 'bcrypt';
import User from '../models/users/user.js';

const createUser = async () => {
  const email = 'ggg@example.com';
  const password = 'Password123';

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    email,
    password: hashedPassword,
    userName: 'Lola',
    fullName: 'Lilia Los',
    role: 'user',
    mustChangePassword: false,
  });

  console.log('user created successfully');
};

createUser().catch((error) => {
  console.error('Error creating user:', error);
});
