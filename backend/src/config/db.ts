import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI не задан в .env');
  }

  try {
    await mongoose.connect(uri);
    console.log(`✅ MongoDB подключена: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ Ошибка подключения к MongoDB:', error);
    throw error;
  }
};