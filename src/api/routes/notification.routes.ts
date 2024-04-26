import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { checkAuthToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/token', checkAuthToken, NotificationController.saveToken);
router.get('/', checkAuthToken, NotificationController.getAllNotifications);
router.post('/create', checkAuthToken, NotificationController.createNotification);

export { router as NotificationRouter };
