import express from 'express';
import defaultMiddleware from '../middleware/defaultMiddleware';
import { welcomeMessage } from '../controllers/defaultControl';

const defaultRoute = express.Router();

// router.get('/', authMiddleware, getAllPosts);
defaultRoute.get('/', defaultMiddleware, welcomeMessage);

export { defaultRoute };
