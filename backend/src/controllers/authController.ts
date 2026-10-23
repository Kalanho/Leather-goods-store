import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import Admin from '../models/Admin';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middlewares/errorHandler';

const signToken = (id: string, role: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new AppError('JWT_SECRET не задан', 500);

  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'],
  };

  return jwt.sign({ id, role }, secret, options);
};

// POST /api/auth/login
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  console.log('\n--- ПОПЫТКА ВХОДА ---');
  console.log('1. Пришло с фронта:', { email, password });

  if (!email || !password) {
    throw new AppError('Email и пароль обязательны', 400);
  }

  const admin = await Admin.findOne({ email: String(email).toLowerCase() });

  if (!admin) {
    console.log('❌ 2. Админ с таким email НЕ НАЙДЕН в базе!');
    throw new AppError('Неверный email или пароль', 401);
  }

  console.log('✅ 2. Админ найден в базе:', admin.email);
  console.log('3. Хэш пароля в базе:', admin.passwordHash);

  const isMatch = await admin.comparePassword(password);
  
  console.log('4. Пароль совпал?', isMatch);

  if (!isMatch) {
    console.log('❌ 5. Пароли не совпали!');
    throw new AppError('Неверный email или пароль', 401);
  }

  console.log('✅ 5. Успешный вход! Генерируем токен...\n');

  const token = signToken(admin._id.toString(), admin.role);
  // ... дальше без изменений

  res.status(200).json({
    success: true,
    data: {
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    },
  });
});

// GET /api/auth/me
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const admin = await Admin.findById((req as any).admin.id).select(
    '-passwordHash'
  );

  if (!admin) throw new AppError('Админ не найден', 404);

  res.status(200).json({ success: true, data: admin });
});