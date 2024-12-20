import { Request, Response, NextFunction } from 'express';
import { AppRequest } from '../utils/Types';

import multer from 'multer';

// Set up Multer to handle file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory as Buffers
  limits: { fileSize: 4 * 1024 * 1024 }, // 4MB size limit
});

export const uploadMiddleware = upload.single('imageBuffer'); // Field name should match form-data key

export const validateFile = async (
  req: AppRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { imageBuffer } = req.body;

  console.log('imageBuffer:', imageBuffer);
  console.log('imageBuffer:', req.body);

  if (!imageBuffer || !(imageBuffer instanceof Buffer)) {
    res.status(400).json({
      error: 'Bad Request: Missing or invalid file (imageBuffer) in the request body.',
    });
    return;
  }

  next();
};
