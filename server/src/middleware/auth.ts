import { RequestHandler } from "express";
import createHttpError from "http-errors";

export const requiresAuth: RequestHandler = (req,res,next) => {
    if(req.user) {
        next();
    }
    else{
        next(createHttpError(401, "User is not authenticated"));
    }
}

export const requiresAdmin: RequestHandler = (req, res,next) => {
    if(req.user && req.user.isAdmin){
        next();
    }
    else {
        next(createHttpError(403, "You don't have access rights to do this!"));
    }
}