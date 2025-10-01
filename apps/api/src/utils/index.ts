import { Request, Response, NextFunction } from 'express';

export const createApiResponse = <T>(data: T, message?: string) => ({
  data,
  message,
});

export const createErrorResponse = (message: string, statusCode: number = 500) => ({
  error: {
    message,
    statusCode,
  },
});

export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
