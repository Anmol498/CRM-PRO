import express from 'express';
import { protect } from '../middleware/auth.middleware';
import { getMyNotifications, markNotificationAsRead, markAllAsRead, dismissNotification, dismissAllNotifications, deleteNotification } from '../controllers/notification.controller';

const router = express.Router();

router.use(protect); // All notification routes are private

router.route('/').get(getMyNotifications);
router.route('/read-all').put(markAllAsRead);           // Must be before /:id routes
router.route('/dismiss-all').put(dismissAllNotifications);
router.route('/:id/read').put(markNotificationAsRead);
router.route('/:id/dismiss').put(dismissNotification);
router.route('/:id').delete(deleteNotification);

export default router;




