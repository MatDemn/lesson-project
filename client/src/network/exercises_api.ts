import { ConflictError, UnauthorizedError } from "../errors/http_errors";
import { Exercise } from "../models/exercise";
import { fetchData } from "./networkUtils";



export interface ExerciseSelect {
    pageId?: number,
    elemCount?: number,
}

export interface ExerciseResult {
    total: number,
    exercises: Exercise[]
}

export async function fetchExercises({pageId, elemCount}: ExerciseSelect): Promise<ExerciseResult> {
    const response = await fetchData(`/api/exercises/${pageId}/${elemCount}`, { method: "GET" });
    return response.json();
}

export async function fetchExercise(id: string): Promise<Exercise> {
    const response = await fetchData("/api/exercises/"+id, { method: "GET" });
    return response.json();
}

export interface ExerciseInput {
    title: string;
    description: string;
    imagePath?: string;
    difficulty: number;
    courseType: string;
    rightAnswer?: string;
    tags?: string[];
}

export async function createExercise(exercise: ExerciseInput): Promise<Exercise> {
    const response = await fetchData("/api/exercises", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(exercise)
    });
    return response.json();
} 

export async function updateExercise(exercideId: string, exercise: ExerciseInput): Promise<Exercise> {
    const response = await fetchData(`/api/exercises/${exercideId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(exercise),
    });
    return response.json();
}

export async function deleteExercise(exerciseId: string) {
    await fetchData(`/api/exercises/${exerciseId}`, {method: "DELETE"});
}