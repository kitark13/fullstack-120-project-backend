import { Router } from "express";
import { celebrate } from "celebrate";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUserSession,
  //   requestResetEmail,
  //   resetPassword,
} from "../controllers/authController.js";
import {
  registerUserSchema,
  loginUserSchema,
  //   requestResetEmailSchema,
  //   resetPasswordSchema,
} from "../validations/authValidation.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

router.post("/auth/register", celebrate(registerUserSchema), registerUser);
router.post("/auth/login", celebrate(loginUserSchema), loginUser);
router.post("/auth/logout", authenticate, logoutUser);
router.post("/auth/refresh", refreshUserSession);
// router.post(
//   '/auth/request-reset-email',
//   celebrate(requestResetEmailSchema),
//   requestResetEmail,
// );
// router.post(
//   '/auth/reset-password',
//   celebrate(resetPasswordSchema),
//   resetPassword,
// );

export default router;
