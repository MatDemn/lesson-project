import { google, calendar_v3 } from "googleapis";
import Calendar = calendar_v3.Calendar;
import Schema$Events = calendar_v3.Schema$Events;
import env from '../utils/validateEnv';
import { RequestHandler } from "express";
import { LessonEvent } from "../models/lessonEvent";
import createHttpError = require("http-errors");
import { IPredicate } from "../utils/predicate";

function getNext7DaysDate(refDate: Date): Date {
    refDate.setDate(refDate.getDate() + 6);
    return refDate;
}

function parseApiResponse(response: Schema$Events, predicate: IPredicate): LessonEvent[] {
    const resultLessonEvents: LessonEvent[] = [];
        response.items?.filter(predicate)?.map((item) => {
            resultLessonEvents.push({
                id: item.id, 
                discordId: item.summary, 
                startDate: item.start?.dateTime, 
                endDate: item.end?.dateTime})
            });
    return resultLessonEvents;
}

export const getAllCurrentWeekEvents : RequestHandler = async (req,res,next) => {
    try {
        const beginDate = new Date();
        beginDate.setHours(0, 0, 0, 0);
        const calendar: Calendar = google.calendar({ version: 'v3', auth: env.GOOGLE_APIKEY });
        const schemaEvents: Schema$Events = 
            (await calendar.events.list(
                {
                    calendarId: env.GOOGLE_CALENDARID, 
                    timeMin: beginDate.toISOString(), 
                    timeMax: getNext7DaysDate(beginDate).toISOString()
                })).data;
        res.status(200).json(parseApiResponse(schemaEvents, () => true));
    }
    catch(error) {
        next(error);
    }
    
};

export const getCurrentWeekEvents : RequestHandler = async (req,res,next) => {
    try {
        const discordId = req.params.discordId;
        if(!discordId) {
            throw createHttpError(400, "DiscordId is required!");
        }

        const beginDate = new Date();
        beginDate.setHours(0, 0, 0, 0);
        const calendar: Calendar = google.calendar({ version: 'v3', auth: env.GOOGLE_APIKEY });
        const schemaEvents: Schema$Events = 
            (await calendar.events.list(
                {
                    calendarId: env.GOOGLE_CALENDARID, 
                    timeMin: beginDate.toISOString(), 
                    timeMax: getNext7DaysDate(beginDate).toISOString()
                })).data;
        const parsedApiRes = parseApiResponse(schemaEvents, elem => elem.summary == discordId);
        res.status(200).json(parsedApiRes);
    }
    catch(error) {
        next(error);
    }
    
};