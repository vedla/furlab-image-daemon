import { Request, Response } from 'express';

/**
 * Get all posts with optional filtering.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} - Sends the list of posts as a JSON response.
 */
export const welcomeMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({ results: 'Welcome' });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};
