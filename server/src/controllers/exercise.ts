import { RequestHandler } from "express";
import ExerciseModel, {CourseType} from "../models/exercise";
import createHttpError from "http-errors";
import mongoose from "mongoose";

interface GetExercisesParams {
    pageId: number,
    elemCount: number
}

export const getExercises: RequestHandler<GetExercisesParams, unknown, unknown, unknown> = async (req,res,next) => {
    try { 
        const pageId = req.params.pageId || 1;
        const elemCount = req.params.elemCount || 10;
        if(pageId < 1 || elemCount < 1) {
            throw createHttpError(400, "Invalid pagination options! pageId<1 or elemCount<1");
        }
        const skipCount = (pageId-1)*elemCount;
        const exercise = await ExerciseModel.find().skip(skipCount).limit(elemCount).exec();
        const exerciseCount = await ExerciseModel.find().count({}).exec();
        res.status(200).json({"total": exerciseCount, "exercises" : exercise});
    }
    catch(error) {
        next(error);
    }
    
};

export const getExercise: RequestHandler = async (req,res,next) => {
    const id = req.params.id;
    try {
        if(!mongoose.isValidObjectId(id)) {
            throw createHttpError(400, "Invalid exercise id");
        }

        const exercise = await ExerciseModel.findById(id).exec();

        if(!exercise){
            throw createHttpError(404, "Exercise not found");
        } 

        res.status(200).json(exercise);
    }
    catch(error) {
      next(error);
    }
};

interface CreateExerciseBody {
    title?: string,
    description?: string,
    imagePath?: string,
    difficulty?: number,
    courseType?: string,
    rightAnswer?: string,
    tags?: string[],
}

export const createExercise: RequestHandler<unknown, unknown, CreateExerciseBody, unknown> = async (req,res,next) => {
    const title = req.body.title;
    const description = req.body.description;
    const imagePath = req.body.imagePath;
    const difficulty = req.body.difficulty;
    const courseType = req.body.courseType;
    const rightAnswer = req.body.rightAnswer;
    const tags = req.body.tags;
    
    try {
        if(!title || !description || !difficulty || !courseType) {
            throw createHttpError(400, "Title, Description, Difficulty and CourseType are required!");
        }

        const newExercise = await ExerciseModel.create({
            title: title,
            description: description,
            imagePath: imagePath,
            difficulty: difficulty,
            courseType: courseType,
            rightAnswer: rightAnswer,
            tags: tags,
        });
        res.status(201).json(newExercise);
    }
    catch(error) {
      next(error);
    }
};

interface UpdateExerciseParams {
    id?: string
}

interface UpdateExerciseBody {
    title?: string,
    description?: string,
    imagePath?: string,
    difficulty?: number,
    courseType?: CourseType,
    rightAnswer?: string,
    tags?: string[],
}

export const updateExercise: RequestHandler<UpdateExerciseParams, unknown, UpdateExerciseBody, unknown> = async (req,res,next) => {
    const id = req.params.id;
    const newTitle = req.body.title;
    const newDescription = req.body.description;
    const newImagePath = req.body.imagePath;
    const newDifficulty = req.body.difficulty;
    const newCourseType = req.body.courseType;
    const newRightAnswer = req.body.rightAnswer;
    const newTags = req.body.tags || [];
    
    try {
        if(!mongoose.isValidObjectId(id)) {
            throw createHttpError(400, "Invalid exercise id");
        }
        
        if(!newTitle || !newDescription || !newDifficulty || !newCourseType) {
            throw createHttpError(400, "Title, Description, Difficulty and CourseType are required!");
        }

        if(!Object.values(CourseType).includes(newCourseType)) { 
            throw createHttpError(400, "Invalid course type. Proper values are: 'computerScience', 'maths', 'other'.");
        }

        const exercise = await ExerciseModel.findById(id).exec();

        if(!exercise){
            throw createHttpError(404, "Exercise not found");
        }

        exercise.title = newTitle;
        exercise.description = newDescription;
        exercise.imagePath = newImagePath;
        exercise.difficulty = newDifficulty;
        exercise.courseType = newCourseType;
        exercise.rightAnswer = newRightAnswer;
        exercise.tags = newTags;

        const updatedExercise = await exercise.save();

        res.status(200).json(updatedExercise);
    }
    catch(error) {
      next(error);
    }
};

export const deleteExercise: RequestHandler = async (req,res,next) => {
    const id = req.params.id;
    try {
        if(!mongoose.isValidObjectId(id)) {
            throw createHttpError(400, "Invalid exercise id");
        }

        const exercise = await ExerciseModel.findById(id).exec();
        if(!exercise) {
            throw createHttpError(404, "Exercise not found");
        }

        await exercise.deleteOne();

        res.sendStatus(204);

    } catch (error) {
        next(error);
    }
};