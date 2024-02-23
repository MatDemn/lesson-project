import { RequestHandler } from "express";
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import env from '../utils/validateEnv';
import { randomBytes } from "crypto";
import createHttpError from "http-errors";

const s3 = new S3Client({
    region: env.AWS_REGION,
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY,
        secretAccessKey: env.AWS_ACCESS_SECRET,
    },
});

export const getImage: RequestHandler = async (req,res,next) => {
    try { 
        //const imageId = req.params.imageId;
        
        res.status(204).json({"TODO": "NOT IMPLEMENTED YET"});
    }
    catch(error) {
        next(error);
    }
};

export const getSecureImagePostURL: RequestHandler = async(req,res,next) => {
    try {
        const rawBytes = await randomBytes(16);
        const imageName = rawBytes.toString('hex');

        const uploadURL = await getSignedUrl(
            s3, 
            new PutObjectCommand({ Bucket: env.AWS_BUCKETNAME, Key: imageName }), 
            {expiresIn: 60}
        );
        res.status(200).json(uploadURL); 
    } catch (error) {
        next(error);
    }
}

export const delImage: RequestHandler = async(req,res,next) => {
    try {
        const imageId = req.params.imageId;
        if(!imageId) {
            throw createHttpError(400, "Invalid imageId");
        }

        await s3.send(new DeleteObjectCommand({Bucket: env.AWS_BUCKETNAME, Key: imageId}));
        res.sendStatus(204); 

    } catch(error) {
        next(error);
    }
}
