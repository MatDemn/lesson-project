import { InferSchemaType, model,  Schema} from "mongoose";

export enum CourseType {
    ComputerScience = 'computerScience',
    Maths = 'maths',
    Other = 'other',
}

const exerciseSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imagePath: {
        type: String,
        required: false,
    },
    difficulty: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    courseType: {
        type: String,
        required: true,
        enum: CourseType,
        default: 'other',
    },
    rightAnswer: {
        type: String,
        required: false,
    },
    tags: [{
        type: String,
        default: [],
    }],
    
}, {timestamps: true});

type Exercise = InferSchemaType<typeof exerciseSchema>;

export default model<Exercise>('Exercise', exerciseSchema);