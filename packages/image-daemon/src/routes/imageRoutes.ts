import express from 'express';
import { getSearch, handleImageSearch } from '../controllers/imageController';
import { authMiddleware, validateFile, uploadMiddleware } from '@furlab-api/shared';
import { getAllPosts } from '../controllers/postController';

const router = express.Router();

// router.get('/', authMiddleware, getAllPosts);
router.get('/', getAllPosts);

router.get('/search', getSearch);

// router.post('/search', handleImageSearch);
// Use the uploadMiddleware for this route
router.post('/search', uploadMiddleware, handleImageSearch);
// router.post('/search', validateFile, handleImageSearch);

export default router;
