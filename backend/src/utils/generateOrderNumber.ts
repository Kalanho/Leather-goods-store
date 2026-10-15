import Order from '../models/Order';

export const generateOrderNumber = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const prefix = `MC-${year}-`;

  // Находим последний заказ этого года
  const lastOrder = await Order.findOne({
    orderNumber: { $regex: `^${prefix}` },
  })
    .sort({ orderNumber: -1 })
    .select('orderNumber')
    .lean();

  let nextNumber = 1;

  if (lastOrder?.orderNumber) {
    const lastSeq = parseInt(lastOrder.orderNumber.split('-')[2], 10);
    if (!isNaN(lastSeq)) nextNumber = lastSeq + 1;
  }

  return `${prefix}${String(nextNumber).padStart(4, '0')}`;
};