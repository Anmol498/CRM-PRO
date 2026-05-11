import { Router } from 'express';
import { loginUser, logoutUser, getMe } from '../controllers/auth.controller';
import { loginRateLimiter } from '../middleware/rateLimiter.middleware';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.post('/login', loginRateLimiter, loginUser);
router.post('/logout', protect, logoutUser);
router.get('/me', protect, getMe);

export default router;
