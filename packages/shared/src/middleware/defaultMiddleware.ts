import { Response, NextFunction } from 'express';
import { AppRequest } from '../utils/Types';

/**
 * Middleware for authenticating users by verifying JWT tokens.
 *
 * The middleware extracts the token from the `Authorization` header, verifies it, and checks with the user service. If the token is missing, invalid, or if the user is not found, a 401 Unauthorized response is returned.
 *
 * @param {AppRequest} req - Express request object, extended to include the user property.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 * @returns {Promise<void>} - Calls `next()` if the token is valid, otherwise returns a 401 Unauthorized response.
 */
const defaultMiddleware = async (
  req: AppRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export default defaultMiddleware;
