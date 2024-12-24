import express from 'express';
import { getSearch, handleImageSearch } from '../controllers/imageController';
import { validateFile, uploadMiddleware } from '@furlab-api/shared';
import authMiddleware from '../../../shared/src/middleware/authMiddleware';
import { getAllPosts } from '../controllers/postController';

const router = express.Router();

// Public routes
router.get('/', authMiddleware, getAllPosts);

router.get('/search', authMiddleware, getSearch);

// POST /search
// router.post(
//   '/search',
//   authMiddleware, // Authenticate first
//   // uploadMiddleware, // Parse file
//   // validateFile, // Validate parsed file
//   handleImageSearch // Handle the main logic
// );

router.post('/search', authMiddleware, uploadMiddleware, handleImageSearch);

export default router;
