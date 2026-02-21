import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { upload } from '../middleware/multer.js';
import { celebrate } from 'celebrate';
import {
  getCurrentUser,
  getUserById,
  getUsers,
  updateUser,
  updateUserAvatar,
} from '../controllers/userController.js';
import {
  updateUserSchema,
  userIdSchema,
} from '../validations/userValidation.js';

const router = Router();

router.get('/users', getUsers);
router.get('/users/me', authenticate, getCurrentUser);
router.patch(
  '/users/me/avatar',
  authenticate,
  upload.single('avatar'),
  updateUserAvatar,
);
router.patch(
  '/users/me/update',
  authenticate,
  celebrate(updateUserSchema),
  updateUser,
);
router.get('/users/:userId', celebrate(userIdSchema), getUserById);

export default router;
