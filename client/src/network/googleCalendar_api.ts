import { LessonEvent } from "../models/lessonEvent";
import { fetchData } from "./networkUtils";

export async function fetchAllCurrentWeek(): Promise<LessonEvent[]> {
    const response = await fetchData("/api/calendar", {method: "GET"});
    return response.json();
}

export async function fetchCurrentWeek(discordId: string): Promise<LessonEvent[]> {
    const response = await fetchData(`/api/calendar/${discordId}`, { method: "GET" });
    return response.json();
}