import mongoose, { Schema, Document } from 'mongoose';

export interface IArticle extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  isPublished: boolean;
}

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String, required: true },
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: [{ type: String }],
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IArticle>('Article', ArticleSchema);