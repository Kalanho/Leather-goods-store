import 'dotenv/config';
import app from './app';
import { connectDB } from './config/db';

const PORT = Number(process.env.PORT) || 5000;

const bootstrap = async (): Promise<void> => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
    console.log(`📦 Окружение: ${process.env.NODE_ENV}`);
  });
};

bootstrap().catch((err) => {
  console.error('❌ Критическая ошибка при запуске:', err);
  process.exit(1);
});