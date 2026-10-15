import { Request, Response } from 'express';
import Order, { IOrderItem } from '../models/Order';
import Product from '../models/Product';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middlewares/errorHandler';
import { generateOrderNumber } from '../utils/generateOrderNumber';

// ─────────────────────────────────────────────
// POST /api/orders
// Создание заказа без регистрации
// Итог считаем ТОЛЬКО на сервере
// ─────────────────────────────────────────────
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { customer, items, delivery } = req.body;

  if (!customer?.fullName || !customer?.phone || !customer?.email) {
    throw new AppError('Не заполнены обязательные контактные данные', 400);
  }
  if (!Array.isArray(items) || items.length === 0) {
    throw new AppError('Корзина пуста', 400);
  }
  if (!delivery?.provider || !delivery?.method) {
    throw new AppError('Не указан способ доставки', 400);
  }

  let subtotal = 0;
  const serverItems: IOrderItem[] = [];

  for (const item of items) {
    const product = await Product.findOne({
      _id: item.productId,
      isActive: true,
    });

    if (!product) {
      throw new AppError(`Товар не найден: ${item.productId}`, 404);
    }

    const variant = product.variants.find((v) => v.sku === item.variantSku);
    if (!variant) {
      throw new AppError(
        `Вариант ${item.variantSku} недоступен для товара "${product.name}"`,
        400
      );
    }

    if (variant.stock < item.quantity) {
      throw new AppError(
        `Недостаточно товара "${product.name}" (${variant.color}). В наличии: ${variant.stock}`,
        400
      );
    }

    const quantity = Math.max(1, Number(item.quantity) || 1);
    const itemPrice = variant.price;
    let itemTotal = itemPrice * quantity;


    let personalization = undefined;
    if (item.personalization?.value) {
      const opt = product.personalizationOptions.find(
        (o) => o.type === item.personalization.type && o.isActive
      );
      if (!opt) {
        throw new AppError(
          `Гравировка недоступна для товара "${product.name}"`,
          400
        );
      }
      itemTotal += opt.price;
      personalization = {
        type: opt.type,
        value: String(item.personalization.value).slice(
          0,
          opt.maxLength || 100
        ),
        price: opt.price,
      };
    }

 
    let giftBox = false;
    let giftBoxPrice = 0;
    if (item.giftBox && product.giftBoxAvailable && product.giftBoxProductId) {
      const box = await Product.findById(product.giftBoxProductId);
      if (box && box.isActive) {
        giftBox = true;
        giftBoxPrice = box.basePrice;
        itemTotal += giftBoxPrice;
      }
    }

    subtotal += itemTotal;

    serverItems.push({
      productId: product._id as any,
      variantSku: variant.sku,
      color: variant.color,
      size: variant.size,
      quantity,
      price: itemPrice,
      personalization,
      giftBox,
      giftBoxPrice,
    });
  }


  const deliveryPrice = Number(req.body.deliveryPrice) || 0;

  const total = Math.max(0, subtotal + deliveryPrice);


  const orderNumber = await generateOrderNumber();

  const order = await Order.create({
    orderNumber,
    customer,
    items: serverItems,
    subtotal,
    deliveryPrice,
    discount: 0,
    total,
    delivery: {
      provider: delivery.provider,
      method: delivery.method,
      status: 'created',
    },
    payment: {
      provider: req.body.payment?.provider || 'yookassa',
      status: 'pending',
    },
  });

 
  for (const item of serverItems) {
    await Product.updateOne(
      { _id: item.productId, 'variants.sku': item.variantSku },
      { $inc: { 'variants.$.stock': -item.quantity } }
    );
  }

  res.status(201).json({
    success: true,
    data: {
      orderNumber: order.orderNumber,
      total: order.total,
      subtotal: order.subtotal,
      deliveryPrice: order.deliveryPrice,
      _id: order._id,
    },
  });
});

// ─────────────────────────────────────────────
// GET /api/orders/:orderNumber
// Публичный просмотр заказа по номеру
// ─────────────────────────────────────────────
export const getOrderByNumber = asyncHandler(
  async (req: Request, res: Response) => {
    const { orderNumber } = req.params;

    const order = await Order.findOne({ orderNumber }).populate(
      'items.productId',
      'name slug images'
    );

    if (!order) {
      throw new AppError('Заказ не найден', 404);
    }

    res.status(200).json({ success: true, data: order });
  }
);

// ─────────────────────────────────────────────
// GET /api/orders
// Список заказов (для админа — позже закроем)
// ─────────────────────────────────────────────
export const getAllOrders = asyncHandler(
  async (req: Request, res: Response) => {
    const { status, page = '1', limit = '20' } = req.query;

    const filter: any = {};
    if (status) filter['payment.status'] = status;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));

    const [items, total] = await Promise.all([
      Order.find(filter)
        .sort('-createdAt')
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      Order.countDocuments(filter),
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
  }
);

// ─────────────────────────────────────────────
// PATCH /api/orders/:id/status
// Смена статуса оплаты / доставки
// ─────────────────────────────────────────────
export const updateOrderStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { paymentStatus, deliveryStatus, trackNumber } = req.body;

    const update: any = {};
    if (paymentStatus) {
      update['payment.status'] = paymentStatus;
      if (paymentStatus === 'paid') update['payment.paidAt'] = new Date();
    }
    if (deliveryStatus) update['delivery.status'] = deliveryStatus;
    if (trackNumber) update['delivery.trackNumber'] = trackNumber;

    const order = await Order.findByIdAndUpdate(id, update, { new: true });

    if (!order) {
      throw new AppError('Заказ не найден', 404);
    }

    res.status(200).json({ success: true, data: order });
  }
);