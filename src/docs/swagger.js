import swaggerJSDoc from 'swagger-jsdoc';
import j2s from 'joi-to-swagger';
import { updateUserSchema } from '../validations/userValidation.js';

// ✅ 1. ІМПОРТУЄМО JOI SCHEMAS
import {
  registerUserSchema,
  loginUserSchema,
} from '../validations/authValidation.js';

import {
  createStorySchema,
  updateStorySchema,
} from '../validations/storyValidation.js';

// ✅ 2. КОНВЕРТУЄМО JOI → SWAGGER
const { swagger: registerSchema } = j2s(registerUserSchema.body);
const { swagger: loginSchema } = j2s(loginUserSchema.body);

const { swagger: createStorySwagger } = j2s(createStorySchema.body);
const { swagger: updateStorySwagger } = j2s(updateStorySchema.body);

const { swagger: updateUserSwagger } = j2s(updateUserSchema.body);

// ✅ 3. SWAGGER OPTIONS
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Travelers API',
      version: '1.0.0',
      description: 'API documentation for Travelers project',
    },

    servers: [
      {
        url: 'http://localhost:4000',
      },
    ],

    // ✅ 4. ДОДАЄМО COMPONENTS
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },

        schemas: {
  RegisterUser: registerSchema,
  LoginUser: loginSchema,
  CreateStory: createStorySwagger,
  UpdateStory: updateStorySwagger,
  UpdateUser: updateUserSwagger,
},
      },
    },


  apis: ['./src/routes/*.js'],
};

export const swaggerSpec = swaggerJSDoc(options);
