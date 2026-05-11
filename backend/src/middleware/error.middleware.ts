import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    success: false,
    message: err.message,
    stack: env.NODE_ENV === 'production' ? null : err.stack,
  });
};




