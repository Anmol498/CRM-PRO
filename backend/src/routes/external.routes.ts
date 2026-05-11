import express from 'express';
import { createExternalLead } from '../controllers/external.controller';
import { ipWhitelist } from '../middleware/ipWhitelist.middleware';

const router = express.Router();

// Apply IP whitelisting to external lead generation
router.post('/lead', ipWhitelist, createExternalLead);

export default router;
