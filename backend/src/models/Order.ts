import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IOrderItem {
  productId: Types.ObjectId;
  variantSku: string;
  color: string;
  size?: string;
  quantity: number;
  price: number;
  personalization?: {
    type: 'text' | 'image';
    value: string;
    price: number;
  };
  giftBox?: boolean;
  giftBoxPrice?: number;
}

export interface ICustomer {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode?: string;
  comment?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  customer: ICustomer;
  items: IOrderItem[];
  subtotal: number;
  deliveryPrice: number;
  discount: number;
  total: number;
  isArchived?: boolean;
  
  // Архивация (выполнен / в архиве)
  isCompleted: boolean; 

  delivery: {
    provider: 'cdek' | 'pickup' | 'other';
    method: string;
    trackNumber?: string;
    status: string;
  };

  payment: {
    provider: 'yookassa' | 'cloudpayments' | 'other';
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    paidAt?: Date;
    externalId?: string;
  };

  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    variantSku: { type: String, required: true },
    color: { type: String, required: true },
    size: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    personalization: {
      type: {
        type: String,
        enum: ['text', 'image'],
      },
      value: String,
      price: Number,
    },
    giftBox: { type: Boolean, default: false },
    giftBoxPrice: { type: Number, default: 0 },
  },
  { _id: false }
);

const CustomerSchema = new Schema<ICustomer>(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String },
    comment: { type: String },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    customer: { type: CustomerSchema, required: true },
    items: { type: [OrderItemSchema], required: true },

    subtotal: { type: Number, required: true, min: 0 },
    deliveryPrice: { type: Number, required: true, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    
    // Архивация заказа
    isCompleted: { type: Boolean, default: false, index: true },

    delivery: {
      provider: { type: String, enum: ['cdek', 'pickup', 'other'], required: true },
      method: { type: String, required: true },
      trackNumber: { type: String },
      status: { type: String, default: 'created' },
    },

    payment: {
      provider: { type: String, enum: ['yookassa', 'cloudpayments', 'other'], required: true },
      status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending',
      },
      paidAt: { type: Date },
      externalId: { type: String },
    },
    isArchived: { type: Boolean, default: false, index: true },
  },
  
  { timestamps: true }
);

export default mongoose.model<IOrder>('Order', OrderSchema);