import express from 'express';
import { getGlobalSync } from '../controllers/sync.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect);

router.get('/', getGlobalSync);

export default router;




