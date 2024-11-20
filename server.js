import 'dotenv/config';
import express from 'express';
import sequelize from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import cors from 'cors';
import User from './models/users/user.js';
import { getAllUsers } from './controllers/adminController.js';
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

const checkSuperAdminExists = async () => {
  const superAdmin = await User.findOne({ where: { role: 'superAdmin' } });
  if (!superAdmin) {
    console.warn('WARNING: No SuperAdmin account exists!');
  }
};

sequelize.authenticate().then(async () => {
  console.log('Database connected');
  await checkSuperAdminExists();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
