import express from 'express';
import defaultMiddleware from '../middleware/middleware';
import { welcomeMessage } from '../controllers/controller';

const defaultRoute = express.Router();

// router.get('/', authMiddleware, getAllPosts);
defaultRoute.get('/', welcomeMessage);

export { defaultRoute };
