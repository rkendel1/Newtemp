import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/error-handler';
import { notFoundHandler } from './middleware/not-found-handler';
import { authRoutes } from './groups/auth';
import { userRoutes } from './groups/user';
import { subscriptionRoutes } from './groups/subscription';
import { creatorRoutes } from './groups/creator';
import { stripeRoutes } from './groups/stripe';
import { subscriberRoutes } from './groups/subscriber';
import { platformRoutes } from './groups/platform';

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/creators', creatorRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/platform', platformRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 API server running on port ${PORT}`);
});
