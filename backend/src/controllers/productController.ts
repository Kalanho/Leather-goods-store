import { Request, Response } from 'express';
import Product, { IProduct } from '../models/Product';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middlewares/errorHandler';
import { makeUniqueSlug } from '../utils/slugify';

// ─────────────────────────────────────────────
// GET /api/products
// Список с фильтрами, сортировкой, пагинацией
// ─────────────────────────────────────────────
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const {
    category,
    subCategory,
    color,
    material,
    minPrice,
    maxPrice,
    isPreOrder,
    isTopSelling,
    search,
    sort = '-createdAt',
    page = '1',
    limit = '12',
  } = req.query;

  const filter: any = { isActive: true };

  if (category) filter.category = String(category);
  if (subCategory) filter.subCategory = String(subCategory);
  if (material) filter.material = String(material);
  if (isPreOrder !== undefined) filter.isPreOrder = isPreOrder === 'true';
  if (isTopSelling !== undefined) filter.isTopSelling = isTopSelling === 'true';

  if (color) filter['variants.color'] = String(color);

  if (minPrice || maxPrice) {
    filter.basePrice = {};
    if (minPrice) filter.basePrice.$gte = Number(minPrice);
    if (maxPrice) filter.basePrice.$lte = Number(maxPrice);
  }

  if (search) {
    filter.$text = { $search: String(search) };
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(50, Math.max(1, Number(limit)));
  const skip = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    Product.find(filter)
      .sort(String(sort)) 
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Product.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: items,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
    },
  });
});

// ─────────────────────────────────────────────
// GET /api/products/:slug
// Один товар по слагу
// ─────────────────────────────────────────────
export const getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;

  const product = await Product.findOne({ slug, isActive: true });

  if (!product) {
    throw new AppError('Товар не найден', 404);
  }

  res.status(200).json({ success: true, data: product });
});

// ─────────────────────────────────────────────
// POST /api/products
// Создание товара (пока без авторизации — закроем позже)
// ─────────────────────────────────────────────
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as Partial<IProduct>;

  if (!body.name || !body.basePrice) {
    throw new AppError('Поля "name" и "basePrice" обязательны', 400);
  }

  const slug = await makeUniqueSlug(body.name, async (s) => {
    const exists = await Product.exists({ slug: s });
    return !!exists;
  });

  const product = await Product.create({
    ...body,
    slug,
  });

  res.status(201).json({ success: true, data: product });
});

// ─────────────────────────────────────────────
// PATCH /api/products/:id
// Обновление товара
// ─────────────────────────────────────────────
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  if (updates.name) {
    updates.slug = await makeUniqueSlug(updates.name, async (s) => {
      const exists = await Product.exists({ slug: s, _id: { $ne: id } });
      return !!exists;
    });
  }

  const product = await Product.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new AppError('Товар не найден', 404);
  }

  res.status(200).json({ success: true, data: product });
});

// ─────────────────────────────────────────────
// DELETE /api/products/:id
// Мягкое удаление (isActive = false)
// ─────────────────────────────────────────────
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await Product.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  if (!product) {
    throw new AppError('Товар не найден', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Товар скрыт из каталога',
    data: product,
  });
});