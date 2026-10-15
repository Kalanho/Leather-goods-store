import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;

  console.error(`[ERROR] ${statusCode} — ${err.message}`);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Внутренняя ошибка сервера',
  });
};

export const notFound = (_req: Request, res: Response): void => {
  res.status(404).json({ success: false, message: 'Маршрут не найден' });
};