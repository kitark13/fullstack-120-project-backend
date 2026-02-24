import 'dotenv/config';
import express from 'express';
import { logger } from './middleware/logger.js';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errors } from 'celebrate';
import { errorHandler } from './middleware/errorHandler.js';
import { connectMongoDB } from './db/connectMongoDB.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import categoriesRoutes from './routes/categoriesRoutes.js';
import storiesRoutes from './routes/storiesRoutes.js';

const PORT = process.env.PORT ?? 3000;
const app = express();

app.use(logger);
app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));
app.use(helmet());
app.use(cookieParser());
app.use(express.json());

app.use(authRoutes);
app.use(userRoutes);
app.use(categoriesRoutes);
app.use(storiesRoutes);

app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
