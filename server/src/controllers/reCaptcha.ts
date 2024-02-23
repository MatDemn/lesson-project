import axios from "axios";
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import env from '../utils/validateEnv';

export const validateToken : RequestHandler = async (req,res,next) => { 
    const token = req.body.token;
    try {
        if(!token) {
            throw createHttpError(400, "No token provided.");
        }
        
        const { data } = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${env.reCAPTCHA_SECRET}&response=${token}`,
        );
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
}