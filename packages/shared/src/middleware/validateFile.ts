import { Request, Response, NextFunction } from 'express';
import { AppRequest } from '../utils/Types';

import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(), // Store uploaded files in memory
  limits: { fileSize: 4 * 1024 * 1024 }, // Limit to 4MB
});

export const uploadMiddleware = upload.single('imageBuffer'); // Field name should match the key used in FormData

export const validateFile = async (
  req: AppRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let file: Buffer | undefined;

  // Check if the file is in `req.file` (multipart form-data)
  if (req.file) {
    file = req.file.buffer; // Extract the buffer from the uploaded file
  } else if (req.body.imageBuffer) {
    // Parse the buffer from `req.body` (application/json or similar)
    file = Buffer.from(req.body.imageBuffer, 'base64'); // Adjust decoding as needed
  }

  if (!file || !(file.buffer instanceof Buffer)) {
    res.status(400).json({
      error: 'E_301 -- Bad Request: Missing or invalid file in the request.',
    });
    return;
  }

  next();
};
