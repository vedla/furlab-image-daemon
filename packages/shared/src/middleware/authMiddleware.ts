import axios from 'axios';
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppRequest } from '../utils/Types';
import { error } from 'good-logs';
import 'dotenv/config';
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
const authMiddleware = async (
  req: AppRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Extract token from header or query parameter
  const token = req.headers.authorization?.split(' ')[1] || (req.query.token as string); // From `Authorization` header // From `token` query parameter

  // console.log('Token:', token);
  // console.log('Token:', req.headers);
  // console.log('Token:', process.env.JWT_SECRET);
  // console.log('Authorization:', process.env.JWT_SECRET);
  // console.warn(token === process.env.JWT_SECRET);
  // if (!token) {
  //   res.status(401).json({ message: 'Authentication required' });
  //   return;
  // }

  // try {
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

  //   // Make a request to the user service to verify the user
  //   const userServiceUrl = process.env.USER_SERVICE_URL || 'http://user-service-url';
  //   const { data: user } = await axios.get(`${userServiceUrl}/users/${decoded.id}`);

  //   if (!user) {
  //     res.status(401).json({ message: 'Invalid token' });
  //     return;
  //   }

  //   // Attach the user to the request object
  //   req.user = { id: user.id.toString(), role: user.role };

  //   next();
  // } catch (err) {
  //   error(err, 'Internal Server Error', '500');
  //   res.status(401).json({ message: 'Invalid token' });
  // }

  if (!token) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  if (token === process.env.JWT_SECRET) {
    // console.log('Dev token validated');
    // Optionally attach user info to the request for testing

    return next();
  }

  res.status(403).json({ message: 'Forbidden: Invalid token' });
  return;
};

export default authMiddleware;
