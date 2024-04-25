import { NextFunction, Request, Response } from 'express';
import admin from '../../config/firebase-admin.config';

/**
 * Middleware to check if the user is authorized and has a valid token
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const checkAuthToken = (req: Request, res: Response, next: NextFunction) => {
  const authToken = req.headers.authorization;
  if (!authToken || !authToken.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'User is not authorize' });
  }

  const token = authToken.split(' ')[1];
  admin
    .auth()
    .verifyIdToken(token)
    .then((decodedToken: any) => {
      req.body.auth = decodedToken;
      next();
    })
    .catch(() => {
      res.status(403).json({ message: 'Expired or invalid token' });
    });
};
