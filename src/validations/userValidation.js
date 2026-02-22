import { Joi, Segments } from 'celebrate';
import { objectIdValidator } from './objectId.js';

export const updateUserSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().trim().max(32),
    description: Joi.string().trim().max(150),
  }).min(1),
};

export const userIdSchema = {
  [Segments.PARAMS]: Joi.object({
    userId: Joi.string().custom(objectIdValidator).required(),
  }),
};
