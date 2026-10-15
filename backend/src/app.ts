import express, { Application } from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import { errorHandler, notFound } from './middlewares/errorHandler';

const app: Application = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK', message: 'Leather Shop API работает' });
});

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;