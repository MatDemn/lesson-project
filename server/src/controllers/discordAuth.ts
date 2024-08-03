import { RequestHandler } from "express";
import env from '../utils/validateEnv';
import passport from "passport";

export const authenticateUser: RequestHandler = async (req, res, next) => {
    try {
        res.writeHead(302, { 'Location': env.DISCORD_AUTH_URL});
        console.log(env.ENV_TYPE);
        res.end();
    } catch (error) {
        next(error);
    }
}

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        next(error); 
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const redirectAfterLogin = 
    passport.authenticate('discord', {
        failureMessage: "Cannot login with Google, please try again later!",
        failureRedirect: (env.ENV_TYPE!="DEV" ? 'http://www.lesson-project.pl' : 'http://localhost:3000')+"/auth/failure",
        successRedirect: (env.ENV_TYPE!="DEV" ? 'http://www.lesson-project.pl' : 'http://localhost:3000')+"/auth/success",
        }
    );

export const logoutUser: RequestHandler = async(req,res,next) => {
    req.logout((err) => {
        if(err) {
            next(err);
        }
        else {
            res.json({status: 200, message: "ok"});
        } 
    });
}



