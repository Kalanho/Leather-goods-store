import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';
import Admin from '../models/Admin';

interface JwtPayload {
  id: string;
  role: string;
}

// Проверяем, что есть валидный токен
export const requireAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new AppError('Требуется авторизация', 401);
    }

    const token = header.split(' ')[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new AppError('JWT_SECRET не задан', 500);

    const decoded = jwt.verify(token, secret) as JwtPayload;

    // Проверяем, что админ ещё существует (на случай удаления)
    const admin = await Admin.findById(decoded.id).select('_id email role name');
    if (!admin) throw new AppError('Админ не найден', 401);

    (req as any).admin = {
      id: admin._id,
      email: admin.email,
      role: admin.role,
      name: admin.name,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }
    // JWT-ошибки
    next(new AppError('Недействительный токен', 401));
  }
};

// Дополнительная защита: только для определённых ролей
export const requireRole = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const admin = (req as any).admin;
    if (!admin || !roles.includes(admin.role)) {
      next(new AppError('Недостаточно прав', 403));
      return;
    }
    next();
  };
};