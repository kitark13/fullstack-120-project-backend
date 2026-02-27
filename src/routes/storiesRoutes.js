import { Router } from 'express';
import { celebrate } from 'celebrate';
import { authenticate } from '../middleware/authenticate.js';

import {
  addSavedStoryController,
  createStoryController,
  deleteStoryController,
  getMyStoriesController,
  getSavedStoriesController,
  getStoriesController,
  getStoryByIdController,
  removeSavedStoryController,
  updateStoryController,
} from '../controllers/storiesController.js';

import {
  createStorySchema,
  getStoriesQuerySchema,
  paginationQuerySchema,
  storyIdParamSchema,
  updateStorySchema,
} from '../validations/storyValidation.js';

const router = Router();

/**
 * @swagger
 * /stories:
 *   get:
 *     summary: Get all stories
 *     tags: [Stories]
 *     responses:
 *       200:
 *         description: Stories list
 */
router.get(
  '/stories',
  celebrate(getStoriesQuerySchema),
  getStoriesController,
);

/**
 * @swagger
 * /stories/saved:
 *   get:
 *     summary: Get saved stories
 *     tags: [Stories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Saved stories list
 */
router.get(
  '/stories/saved',
  authenticate,
  celebrate(paginationQuerySchema),
  getSavedStoriesController,
);

/**
 * @swagger
 * /stories/my:
 *   get:
 *     summary: Get my stories
 *     tags: [Stories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User stories list
 */
router.get(
  '/stories/my',
  authenticate,
  celebrate(paginationQuerySchema),
  getMyStoriesController,
);

/**
 * @swagger
 * /stories/{storyId}:
 *   get:
 *     summary: Get story by id
 *     tags: [Stories]
 *     parameters:
 *       - in: path
 *         name: storyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Story found
 */
router.get(
  '/stories/:storyId',
  celebrate(storyIdParamSchema),
  getStoryByIdController,
);

/**
 * @swagger
 * /stories/{storyId}/save:
 *   post:
 *     summary: Save story
 *     tags: [Stories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Story saved
 */
router.post(
  '/stories/:storyId/save',
  authenticate,
  celebrate(storyIdParamSchema),
  addSavedStoryController,
);

/**
 * @swagger
 * /stories/{storyId}/save:
 *   delete:
 *     summary: Remove saved story
 *     tags: [Stories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Story removed from saved
 */
router.delete(
  '/stories/:storyId/save',
  authenticate,
  celebrate(storyIdParamSchema),
  removeSavedStoryController,
);

/**
 * @swagger
 * /stories/{storyId}:
 *   patch:
 *     summary: Update story
 *     tags: [Stories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Story updated
 */
router.patch(
  '/stories/:storyId',
  authenticate,
  celebrate({
    ...storyIdParamSchema,
    ...updateStorySchema,
  }),
  updateStoryController,
);

/**
 * @swagger
 * /stories/{storyId}:
 *   delete:
 *     summary: Delete story
 *     tags: [Stories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Story deleted
 */
router.delete(
  '/stories/:storyId',
  authenticate,
  celebrate(storyIdParamSchema),
  deleteStoryController,
);

/**
 * @swagger
 * /stories:
 *   post:
 *     summary: Create story
 *     tags: [Stories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Story created
 */
router.post(
  '/stories',
  authenticate,
  celebrate(createStorySchema),
  createStoryController,
);

export default router;
