import express from 'express'
import * as ReCaptchaController from '../controllers/reCaptcha';
import { requiresAuth } from '../middleware/auth';

const router = express.Router()

router.post('/verify', requiresAuth, ReCaptchaController.validateToken);

export default router;
