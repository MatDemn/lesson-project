export interface Exercise {
    _id: string;
    title: string;
    description: string;
    imagePath?: string;
    difficulty: number;
    courseType: string;
    rightAnswer?: string;
    tags?: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}