import { Router } from "express";
import { celebrate } from "celebrate";

import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUserSession,
} from "../controllers/authController.js";

import {
  registerUserSchema,
  loginUserSchema,
} from "../validations/authValidation.js";

import { authenticate } from "../middleware/authenticate.js";

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUser'
 *     responses:
 *       201:
 *         description: User successfully registered
 */
router.post(
  "/auth/register",
  celebrate(registerUserSchema),
  registerUser
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUser'
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post(
  "/auth/login",
  celebrate(loginUserSchema),
  loginUser
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: User logged out
 */
router.post(
  "/auth/logout",
  authenticate,
  logoutUser
);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh user session
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Session refreshed
 */
router.post(
  "/auth/refresh",
  refreshUserSession
);

export default router;
