import type { NextFunction, Request, Response } from 'express';
import winston from 'winston';
import HTTP_STATUS from '@/core/status-codes.constants';

// create an error handling middleware function
export default function (err: Error, _: Request, res: Response, __: NextFunction) {
  // log the error message and error object
  console.log('error middleware called');
  winston.error(err.message, err);
  // set the HTTP response status to 500 and send the error message
  res.sendResponse({
    status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message: 'Internal Server Error',
    data: err.message,
  });
}
