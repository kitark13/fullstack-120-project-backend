import { Joi, Segments } from 'celebrate';
import { objectIdValidator } from './objectId.js';

export const getStoriesQuerySchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(50).default(9),
    category: Joi.string().custom(objectIdValidator).optional(),
  }),
};

export const storyIdParamSchema = {
  [Segments.PARAMS]: Joi.object({
    storyId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const paginationQuerySchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(50).default(9),
  }),
};

export const createStorySchema = {
  [Segments.BODY]: Joi.object({
    img: Joi.string().uri().required(),
    title: Joi.string().max(150).required(),
    article: Joi.string().max(10000).required(),
    category: Joi.string().custom(objectIdValidator).required(),
    date: Joi.string().required(),
  }),
};

export const updateStorySchema = {
  [Segments.BODY]: Joi.object({
    img: Joi.string().uri().optional(),
    title: Joi.string().max(150).optional(),
    article: Joi.string().max(10000).optional(),
    category: Joi.string().custom(objectIdValidator).optional(),
    date: Joi.string().optional(),
  }).min(1),
};
