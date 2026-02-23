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
import { optionalAuthenticate } from '../middleware/optionalAuthenticate.js';

const router = Router();

router.get(
  '/stories',
  celebrate(getStoriesQuerySchema),
  optionalAuthenticate,
  getStoriesController,
);

/**
 * СТВОРИТИ ПРИВАТНИЙ ендпоінт для
 * ОТРИМАННЯ збережених історій + пагінація
 */
router.get(
  '/stories/saved',
  authenticate,
  celebrate(paginationQuerySchema),
  getSavedStoriesController,
);

/**
 * СТВОРИТИ ПРИВАТНИЙ ендпоінт для
 * ОТРИМАННЯ власних історій користувача (автора) + пагінація
 */
router.get(
  '/stories/my',
  authenticate,
  celebrate(paginationQuerySchema),
  getMyStoriesController,
);

router.get(
  '/stories/:storyId',
  celebrate(storyIdParamSchema),
  optionalAuthenticate,
  getStoryByIdController,
);

/**
 * СТВОРИТИ ПРИВАТНИЙ ендпоінт для
 * ДОДАВАННЯ статті до збережених статей користувача
 */
router.post(
  '/stories/:storyId/save',
  authenticate,
  celebrate(storyIdParamSchema),
  addSavedStoryController,
);

/**
 * СТВОРИТИ ПРИВАТНИЙ ендпоінт для
 * ВИДАЛЕННЯ статті зі збережених статей користувача
 */
router.delete(
  '/stories/:storyId/save',
  authenticate,
  celebrate(storyIdParamSchema),
  removeSavedStoryController,
);

/**
 * СТВОРИТИ ПРИВАТНИЙ ендпоінт для
 * РЕДАГУВАННЯ історії
 */
router.patch(
  '/stories/:storyId',
  authenticate,
  celebrate(storyIdParamSchema),
  celebrate(updateStorySchema),
  updateStoryController,
);

/**
 * СТВОРИТИ ПРИВАТНИЙ ендпоінт для
 * ВИДАЛЕННЯ історії
 */
router.delete(
  '/stories/:storyId',
  authenticate,
  celebrate(storyIdParamSchema),
  deleteStoryController,
);

/**
 * СТВОРИТИ ПРИВАТНИЙ ендпоінт для
 * СТВОРЕННЯ історії
 */
router.post(
  '/stories',
  authenticate,
  celebrate(createStorySchema),
  createStoryController,
);

export default router;
