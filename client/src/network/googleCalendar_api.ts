import { LessonEvent } from "../models/lessonEvent";
import { fetchData } from "./networkUtils";

export async function fetchCurrentWeek(weekIndex: number): Promise<LessonEvent[]> {
    const response = await fetchData(`/api/calendar/${weekIndex}`, { method: "GET" });
    return response.json();
}

export interface TimeSlotInput {
    beginDate: string,
    endDate: string,
}

export interface TimeSlotResponse {
    state: boolean,
}

export async function checkTimeSlot(timeSlotInput: TimeSlotInput): Promise<TimeSlotResponse> {
    const response = await fetchData(`/api/calendar/${timeSlotInput.beginDate}/${timeSlotInput.endDate}`, {method: "GET"});
    return response.json();
}

export interface EventInput {
    beginDate: string,
    endDate: string,
    discordId: string,
}

export async function createEvent(eventInput: EventInput): Promise<LessonEvent> {
    const response = await fetchData("/api/calendar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(eventInput)
    });
    return response.json();
}

export async function deleteEvent(id: string, beginDate: string) {
    await fetchData(`/api/calendar/${id}/${beginDate}`, {method: "DELETE"});
}