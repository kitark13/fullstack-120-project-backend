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

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get users list
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Users list retrieved successfully
 */
router.get('/users', getUsers);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 */
router.get('/users/me', authenticate, getCurrentUser);

/**
 * @swagger
 * /users/me/avatar:
 *   patch:
 *     summary: Update user avatar
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Avatar updated successfully
 */
router.patch(
  '/users/me/avatar',
  authenticate,
  upload.single('avatar'),
  updateUserAvatar,
);

/**
 * @swagger
 * /users/me/update:
 *   patch:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.patch(
  '/users/me/update',
  authenticate,
  celebrate(updateUserSchema),
  updateUser,
);

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Get user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 */
router.get(
  '/users/:userId',
  celebrate(userIdSchema),
  getUserById,
);

export default router;
