import { HTTP_STATUS } from '@/core';
import { UserRepository } from '@/database/repositories';
import type { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '@/utils';
import winston from 'winston';
import type { EnumTypes } from '@/database/enums';

const userRepository = new UserRepository();

export function authorize(accessibleRoles: EnumTypes.UserType[] = []) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let token: string | undefined;

      // Get the authorization header from the request
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }

      // If no token in Authrization header, check for the query parameters
      if (!token) {
        token = req.query.accessToken as string | undefined;
        if (!token) {
          return res.sendResponse({
            status: HTTP_STATUS.UNAUTHORIZED,
            message: 'Access denied: No token provided',
            data: undefined,
          });
        }
      }

      // verify the JWT token
      const decoded = verifyAccessToken(token);

      // Check if the user has the required role
      // Security Improvement: Rather than checking the roles in the jwt token,
      // we can check the roles in the database for the user and check,
      // while saving the user and role details to the redis storage for faster middleware handling
      if (accessibleRoles.length > 0 && !accessibleRoles.includes(decoded.userType)) {
        return res.sendResponse({
          status: HTTP_STATUS.FORBIDDEN,
          message: 'Access denied: User does not have the required permissions',
          data: undefined,
        });
      }

      // Retrieve the user from the database
      const user = await userRepository.findById(decoded.id);
      if (!user || user.userStatus !== 'ACTIVE') {
        return res.sendResponse({
          status: HTTP_STATUS.UNAUTHORIZED,
          message: 'Access denied: User not found or inactive',
          data: undefined,
        });
      }

      // Attatch the user to the request object
      req.user = {
        id: user.id!,
        userStatus: user.userStatus,
        userType: user.userType,
      };

      next();
    } catch (error: any) {
      // Handle specific token errors (expired, invalid, etc)
      if (error.name === 'TokenExpiredError') {
        return res.sendResponse({
          status: HTTP_STATUS.UNAUTHORIZED,
          message: 'Token expired: token rotation required',
          data: undefined,
        });
      }

      if (error.name === 'JsonWebTokenError') {
        return res.sendResponse({
          status: HTTP_STATUS.UNAUTHORIZED,
          message: 'Access denied: Invalid token',
          data: undefined,
        });
      }

      winston.error(error.message, error);
      res.sendResponse({
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        message: 'Uncaught Error',
        data: undefined,
      });
    }
  };
}
