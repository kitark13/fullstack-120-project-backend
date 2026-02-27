import { Router } from 'express';
import { getCategoriesController } from '../controllers/categoriesController.js';

const router = Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get categories list
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Categories list retrieved successfully
 */
router.get('/categories', getCategoriesController);

export default router;
