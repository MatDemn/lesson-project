import express from 'express'
import * as DiscordAuthController from '../controllers/discordAuth';
import { requiresAuth } from '../middleware/auth';
//import passport from 'passport';
//import env from "../utils/validateEnv";

const router = express.Router()

router.get('/', DiscordAuthController.authenticateUser);

router.get('/redirect', DiscordAuthController.redirectAfterLogin);

router.get('/user', requiresAuth, DiscordAuthController.getAuthenticatedUser); 

router.get('/logout', requiresAuth, DiscordAuthController.logoutUser);

export default router;