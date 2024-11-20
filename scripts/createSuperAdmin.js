import bcrypt from 'bcrypt';
import User from '../models/users/user.js';

const createSuperAdmin = async () => {
  const email = 'superadmin@example.com';
  const password = 'SuperSecurePassword123';

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    email,
    password: hashedPassword,
    userName: 'Admin',
    fullName:'Olha lazyniuk',
    role: 'superAdmin',
    mustChangePassword: false,
  });

  console.log('SuperAdmin created successfully');
};

createSuperAdmin().catch((error) => {
  console.error('Error creating SuperAdmin:', error);
});
