import { RequestHandler } from "express";
import env from '../utils/validateEnv';

export const authenticateUser: RequestHandler = async (req, res, next) => {
    try {
        res.writeHead(302, { 'Location': env.DISCORD_AUTH_URL});
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



