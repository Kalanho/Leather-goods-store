import mongoose, { Schema, Document, Types } from 'mongoose';

export type MainCategory =
  | 'leather_goods'      
  | 'packaging';        

export type SubCategory =
  | 'documents'          
  | 'wallets'          
  | 'belts'           
  | 'bags'              
  | 'gift_sets'          
  | 'accessories'        
  | 'gift_boxes'         
  | 'none';

export interface IVariant {
  colorName: string;  // Было color
  colorHex: string;   // Новое поле
  size?: string;
  sku: string;
  stock: number;
  price: number;
  image?: string;
}

export interface IPersonalization {
  type: 'text' | 'image';   
  price: number;             
  maxLength?: number;       
  isActive: boolean;
}

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;

 
  category: MainCategory;
  subCategory: SubCategory;

  
  shortDescription: string;
  fullDescription: string;
  material: string;           
  careInstructions?: string;  


  basePrice: number;
  discountPrice?: number;     

  isPreOrder: boolean;
  productionDays?: number;   

 
  images: string[];          
  mobileImages?: string[];    


  variants: IVariant[];
  personalizationOptions: IPersonalization[];

 
  giftBoxAvailable: boolean;
  giftBoxProductId?: Types.ObjectId;  


  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];


  isActive: boolean;
  isTopSelling: boolean;      
  createdAt: Date;
  updatedAt: Date;
}

const VariantSchema = new Schema<IVariant>(
  {
    colorName: { type: String, required: true }, // Изменили имя на colorName
    colorHex: { type: String, default: '#000000' }, // Добавили HEX
    size: { type: String },
    sku: { type: String, required: true },
    stock: { type: Number, required: true, default: 0, min: 0 },
    price: { type: Number, required: true, min: 0 },
    image: { type: String },
  },
  { _id: false }
);

const PersonalizationSchema = new Schema<IPersonalization>(
  {
    type: { type: String, enum: ['text', 'image'], required: true },
    price: { type: Number, required: true, min: 0 },
    maxLength: { type: Number },
    isActive: { type: Boolean, default: true },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },

    category: {
      type: String,
      enum: ['leather_goods', 'packaging'],
      required: true,
      index: true,
    },
    subCategory: {
      type: String,
      enum: ['documents', 'wallets', 'belts', 'bags', 'gift_sets', 'accessories', 'gift_boxes', 'none'],
      default: 'none',
      index: true,
    },

    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    material: { type: String, required: true },
    careInstructions: { type: String },

    basePrice: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },

    isPreOrder: { type: Boolean, default: true },
    productionDays: { type: Number, min: 0 },

    images: [{ type: String }],
    mobileImages: [{ type: String }],

    variants: {
      type: [VariantSchema],
      validate: {
        validator: (v: IVariant[]) => v.length > 0,
        message: 'У товара должен быть хотя бы один вариант',
      },
    },
    personalizationOptions: { type: [PersonalizationSchema], default: [] },

    giftBoxAvailable: { type: Boolean, default: false },
    giftBoxProductId: { type: Schema.Types.ObjectId, ref: 'Product' },

    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: [{ type: String }],

    isActive: { type: Boolean, default: true, index: true },
    isTopSelling: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

ProductSchema.index({ name: 'text', shortDescription: 'text', fullDescription: 'text' });
ProductSchema.index({ category: 1, subCategory: 1, isActive: 1 });

export default mongoose.model<IProduct>('Product', ProductSchema);