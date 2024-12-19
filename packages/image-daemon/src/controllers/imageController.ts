import { Request, Response, NextFunction } from 'express';
import { getCachedResult, cacheResult } from '../services/cacheService';
import { searchFluffle } from '../services/fluffleService';

/**
 * Get all posts with optional filtering.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} - Sends the list of posts as a JSON response.
 */
export const getSearch = async (req: Request, res: Response): Promise<void> => {
  res.status(400).json({ error: 'Hey bud, you have to POST not GET' });
};

declare module 'express' {
  export interface Request {
    file?: {
      buffer: Buffer;
    };
  }
}

export const handleImageSearch = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let imageBuffer: Buffer | undefined;

    // Check if the file is in `req.file` (multipart form-data)
    if (req.file) {
      imageBuffer = req.file.buffer; // Extract the buffer from the uploaded file
    } else if (req.body.imageBuffer) {
      // Parse the buffer from `req.body` (application/json or similar)
      imageBuffer = Buffer.from(req.body.imageBuffer, 'base64'); // Adjust decoding as needed
    }

    const includeNsfw = req.body.includeNsfw === 'true'; // Parse NSFW flag from body

    console.log('imageBuffer:', imageBuffer);
    console.log('includeNsfw:', includeNsfw);

    if (!imageBuffer) {
      res.status(400).json({ error: 'Image buffer is missing' });
      return;
    }

    // Check cache
    const cachedResult = await getCachedResult(imageBuffer);
    if (cachedResult) {
      res.status(200).json(cachedResult);
      return;
    }

    // Search Fluffle
    const fluffleResults = await searchFluffle(imageBuffer, includeNsfw);

    // Cache the results
    const cached = await cacheResult(imageBuffer, fluffleResults);

    res.status(200).json(cached);
  } catch (error) {
    next(error);
  }
};
