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
      imageBuffer = Buffer.from(req.body.file, 'base64'); // Adjust decoding as needed
    }

    const includeNsfw = req.body.includeNsfw === 'true';

    if (!imageBuffer) {
      res.status(400).json({ error: 'Image buffer is missing' });
      return;
    }

    // Check cache

    const cachedResult = await getCachedResult(imageBuffer);
    if (cachedResult) {
      console.log('Returning cached result');
      res.status(200).json(cachedResult);
      return;
    } else {
      console.log('Searching Fluffle');
      // Search Fluffle
      const fluffleResults = await searchFluffle(imageBuffer, includeNsfw);

      // console.log('Fluffle results:', fluffleResults);

      if (!fluffleResults.results.length) {
        console.log('Saving results to cache', fluffleResults.results.length);
        res.status(404).json({ error: 'No results found' });
        return;
      } else {
        // Cache the results
        console.log('Saving results to cache', fluffleResults.results.length);
        const cached = await cacheResult(imageBuffer, fluffleResults);
        res.status(200).json(cached);
        return;
      }
    }
  } catch (error) {
    next(error);
  }
};
