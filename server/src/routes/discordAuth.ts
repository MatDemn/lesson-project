import express from 'express'
import passport from 'passport';
import * as DiscordAuthController from '../controllers/discordAuth';
import { requiresAuth } from '../middleware/auth';

const router = express.Router()

router.get('/', DiscordAuthController.authenticateUser);

router.get('/redirect', passport.authenticate('discord', {
    failureRedirect: '/auth/discord/authFailure',
}),
function (req, res) {
    res.writeHead(302, { 'Location': 'http://localhost:3000/'});
    res.end();
});

router.get('/user', requiresAuth, DiscordAuthController.getAuthenticatedUser); 

router.get('/logout', requiresAuth, (req,res,next) => {
    req.logout((err) => {
        if(err) {
            next(err);
        }
        else {
            res.sendStatus(200);
        } 
    });
});

router.get('/authFailure', (req, res, next) => {
    try{
        res.writeHead(302, { 'Location': 'http://localhost:3000/'});
        res.end();
    }
    catch(error) {
        next(error);
    }
    
});

export default router;