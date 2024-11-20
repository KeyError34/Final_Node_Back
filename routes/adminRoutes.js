import express from 'express';
import { getAllUsers, deleteUser } from '../controllers/adminController.js';
import { updateUserRole } from '../controllers/updateUserRole.js';
import authenticate from '../middleware/auth.js';
import checkRole from '../middleware/checkRole.js';

const router = express.Router();

router.get('/users', authenticate, checkRole('superAdmin'), getAllUsers);
router.delete('/user/:id', authenticate, checkRole('superAdmin'), deleteUser);
router.put(
  '/user/role',
  authenticate,
  checkRole('superAdmin'), 
  updateUserRole
);

export default router;
