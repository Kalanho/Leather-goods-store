import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middlewares/errorHandler';

export const uploadImages = asyncHandler(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[] | undefined;

  if (!files || files.length === 0) {
    throw new AppError('Файлы не загружены', 400);
  }

  // Возвращаем ОТНОСИТЕЛЬНЫЕ URL — их же кладём в Product.images
  const urls = files.map((file) => `/uploads/products/${file.filename}`);

  res.status(201).json({
    success: true,
    data: urls,
  });
});