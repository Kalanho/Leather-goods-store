import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '../src/models/Admin';

const resetAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('✅ Подключение к БД успешно');

    // 1. Удаляем всех админов
    const deleteResult = await Admin.deleteMany({});
    console.log(`🗑️ Удалено старых админов: ${deleteResult.deletedCount}`);

    // 2. Берем данные из .env (или ставим по умолчанию)
    const email = (process.env.ADMIN_EMAIL || 'admin@polesheuk.shop').toLowerCase().trim();
    const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
    const name = process.env.ADMIN_NAME || 'Administrator';

    // 3. Хэшируем пароль и создаем нового
    const passwordHash = await bcrypt.hash(password, 10);
    
    const newAdmin = await Admin.create({
      email,
      passwordHash,
      name,
      role: 'superadmin',
    });

    console.log('✅ Новый админ успешно создан!');
    console.log(`📧 Email: ${newAdmin.email}`);
    console.log(`🔑 Пароль: ${password}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка:', error);
    process.exit(1);
  }
};

resetAdmin();