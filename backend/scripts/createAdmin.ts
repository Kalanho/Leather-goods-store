import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '../src/models/Admin';

const createAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'Administrator';

  if (!email || !password) {
    console.error('❌ Задайте ADMIN_EMAIL и ADMIN_PASSWORD в .env');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('❌ Пароль должен быть минимум 8 символов');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('✅ MongoDB подключена');

    const exists = await Admin.findOne({ email: email.toLowerCase() });
    if (exists) {
      console.log(`ℹ️ Админ с email ${email} уже существует`);
      await mongoose.disconnect();
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      email: email.toLowerCase(),
      passwordHash,
      name,
      role: 'superadmin',
    });

    console.log('✅ Админ создан:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Имя: ${admin.name}`);
    console.log(`   Роль: ${admin.role}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка создания админа:', error);
    process.exit(1);
  }
};

createAdmin();