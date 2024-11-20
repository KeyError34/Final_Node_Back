import express from 'express'
import {
  register,
  login,
  deleteAccount,
  changeEmail,
  logout
}from '../controllers/authController.js';
import authenticate from '../middleware/auth.js';
import checkMustChangePassword from '../middleware/passwordChange.js';
import { changePassword } from '../controllers/chengePassword.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.delete('/delete', authenticate, deleteAccount);
router.put('/change-email', authenticate, checkMustChangePassword, changeEmail);
router.put(
  '/change-password',
  authenticate,
  checkMustChangePassword,
  changePassword
);

export default router;
