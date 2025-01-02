import { Request, Response } from 'express';
import Joi from 'joi';

const posts = [
  {
    id: 1,
    title: 'Nothing to see here',
    content: 'This is query does absolutley nothing.',
  },
];

/**
 * Get all posts with optional filtering.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} - Sends the list of posts as a JSON response.
 */
export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
  const { nsfw, isPrivate } = req.query;

  try {
    res.status(200).json({ results: posts });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};
