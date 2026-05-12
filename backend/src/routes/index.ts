import { Router } from 'express';
import authRoutes from './auth.routes';
import bookingRoutes from './booking.routes';
import userRoutes from './user.routes';
import notificationRoutes from './notification.routes';
import analyticsRoutes from './analytics.routes';
import syncRoutes from './sync.routes';
import externalRoutes from './external.routes';
import settingsRoutes from './settings.routes';
import sseRoutes from './sse.routes';

import { apiRateLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

// Apply global rate limiting to all API routes
router.use(apiRateLimiter);

router.use('/auth', authRoutes);
router.use('/bookings', bookingRoutes);
router.use('/users', userRoutes);
router.use('/notifications', notificationRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/sync', syncRoutes);
router.use('/external', externalRoutes);
router.use('/settings', settingsRoutes);
router.use('/stream', sseRoutes);

export default router;
