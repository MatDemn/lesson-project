import { RequestHandler } from "express";
import aws from 'aws-sdk';
import env from '../utils/validateEnv';
import { randomBytes } from "crypto";
import createHttpError from "http-errors";

const s3 = new aws.S3({
    region: env.AWS_REGION,
    accessKeyId: env.AWS_ACCESS_KEY,
    secretAccessKey: env.AWS_ACCESS_SECRET,
    signatureVersion: 'v4',
});

export const getImage: RequestHandler = async (req,res,next) => {
    try { 
        //const imageId = req.params.imageId;
        
        res.status(200).json({"TODO": "NOT IMPLEMENTED YET"});
    }
    catch(error) {
        next(error);
    }
};

export const getSecureImagePostURL: RequestHandler = async(req,res,next) => {
    try {
        const rawBytes = await randomBytes(16);
        const imageName = rawBytes.toString('hex');

        const params = ({
            Bucket: env.AWS_BUCKETNAME,
            Key: imageName,
            Expires: 60,
        });

        const uploadURL = await s3.getSignedUrlPromise('putObject', params);
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
        const params = ({
            Bucket: env.AWS_BUCKETNAME,
            Key: imageId,
        });
        await s3.deleteObject(params).promise();
        res.sendStatus(204); 

    } catch(error) {
        next(error);
    }
}
