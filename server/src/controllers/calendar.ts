import { calendar_v3 } from "googleapis";
import Schema$Events = calendar_v3.Schema$Events;
import Schema$Event = calendar_v3.Schema$Event;
import env from '../utils/validateEnv';
import { RequestHandler } from "express";
import { LessonEvent } from "../models/lessonEvent";
import createHttpError = require("http-errors");
import { IPredicate } from "../utils/predicate";
import { GoogleCalendar } from "../managers/googleServiceAccount";
import { SimpleCache } from "../cache/cacheController";

const eventsCache = new SimpleCache<Array<Schema$Event>>(50, 60_000);

function getNextKDaysDate(refDate: Date, K: number): Date {
    refDate.setDate(refDate.getDate() + K);
    return refDate;
}

function filterApiResponse(items: calendar_v3.Schema$Event[], predicate: IPredicate): LessonEvent[] {
    const resultLessonEvents: LessonEvent[] = [];
        items?.filter(predicate)?.map((item: calendar_v3.Schema$Event) => {
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
        beginDate.setDate(beginDate.getDate()-1);
        beginDate.setHours(0, 0, 0, 0);

        const schemaEvents: Schema$Events = 
            (await GoogleCalendar.Instance.events.list(
                {
                    calendarId: env.GOOGLE_CALENDARID, 
                    timeMin: beginDate.toISOString(), 
                    timeMax: getNextKDaysDate(beginDate,8).toISOString()
                })).data;
        res.status(200).json(filterApiResponse(schemaEvents.items!, () => true));
    }
    catch(error) {
        next(error);
    }
    
};

interface GetCurrentWeekEventsParams {
    weekIndex: number,
}

export const getCurrentWeekEvents : RequestHandler<GetCurrentWeekEventsParams,unknown, unknown, unknown> = async (req,res,next) => {
    try {
        const weekIndex = req.params.weekIndex;
        if(!weekIndex) {
            throw createHttpError(400, "WeekIndex is required!");
        }
        if(weekIndex < -5 || weekIndex > 5) {
            throw createHttpError(400, "WeekIndex too big or too small.");
        }

        const beginDate = new Date();
        beginDate.setDate(beginDate.getDate()+weekIndex*7);
        beginDate.setHours(0,0,0,0);
        const endDate = new Date(beginDate);
        endDate.setDate(endDate.getDate()+7);
        const schemaEventItems: Schema$Event[] = [];

        const iterDate = new Date(beginDate);
        while(iterDate <= endDate) {
            const currKey = iterDate.toISOString().split('T')[0];
            let entry = eventsCache.get(currKey);
            if(!entry) {
                const fetchedEventItems = 
                (await GoogleCalendar.Instance.events.list(
                    {
                        calendarId: env.GOOGLE_CALENDARID, 
                        timeMin: beginDate.toISOString(), 
                        timeMax: endDate.toISOString(),
                    })).data.items;
                const groupedEvents = fetchedEventItems?.reduce((grouped, element) => {
                    const key = element.start?.dateTime?.split("T")[0];
                    if(!key) {
                        throw createHttpError(500, "Unknown error!");
                    }
                    if(!grouped.has(key)) {
                        grouped.set(key, []);
                    }
                    grouped.get(key)!.push(element);
                    return grouped;
                }, new Map<string,Array<Schema$Event>>());
                
                groupedEvents?.forEach((value, key) => {
                    eventsCache.set(key, value);
                });

                const subIterDate = new Date(beginDate);
                while(subIterDate <= endDate) {
                    const subKey = subIterDate.toISOString().split("T")[0];
                    if(!eventsCache.has(subKey)) {
                        eventsCache.set(subKey, []);
                    }
                    subIterDate.setDate(subIterDate.getDate()+1);
                }

                entry = eventsCache.get(currKey);

                if(entry) {
                    schemaEventItems.push(...entry);
                }
            }
            else {
                schemaEventItems.push(...entry);
            }
            iterDate.setDate(iterDate.getDate()+1);
        }
        
        res.status(200).json(filterApiResponse(schemaEventItems, () => true));
    }
    catch(error) {
        next(error);
    }
};

export const checkForFreeSlot : RequestHandler = async (req,res,next) => {
    try {
        const startDate = new Date(req.params.beginDate);
        const endDate = new Date(req.params.endDate);

        if(isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw createHttpError(400, "Invalid exercise id");
        }

        const schemaEvents = 
            (await GoogleCalendar.Instance.freebusy.query(
                {
                    requestBody: {
                        timeMin: startDate.toISOString(), 
                        timeMax: endDate.toISOString(),
                        items : [{"id": env.GOOGLE_CALENDARID }]
                    }
                })).data.calendars;

        if(!schemaEvents) {
            throw createHttpError(503, "Server could not process request.");
        }
        const resp = Object.values(schemaEvents).every(x => x.busy?.length == 0);
        res.status(200).json({state: resp});
    }
    catch(error) {
        next(error);
    }
}

interface CreateEventBody {
    beginDate?: string,
    endDate?: string,
    discordId?: string,
}

export const createEvent : RequestHandler<unknown,unknown,CreateEventBody,unknown> = async (req,res,next) => {
    try {
        if(!req.body.beginDate || !req.body.endDate || !req.body.discordId) {
            throw createHttpError(400, "BeginDate, EndDate, DiscordId are required!");
        }

        const beginDate = new Date(req.body.beginDate);
        const endDate = new Date(req.body.endDate);
        const discordId = req.body.discordId;

        if(beginDate.getHours()<16 || beginDate.getHours()>22) {
            throw createHttpError(400, "BeginDate should be between 16:00 and 22:00");
        }
        if(endDate.getHours()<16 || endDate.getHours()>22) {
            throw createHttpError(400, "EndDate should be between 16:00 and 22:00");
        }

        // This is a hacky way
        // Today date is shifted forward 18 days and then abs value is calculated
        // Because of that, user cannot book event in the past or too distant one (more than 36 days from now)
        // Moreover, event has to be booked 3h in advance (3*60*60*1000 = 3h)
        if(Math.abs(new Date().getTime() - beginDate.getTime() + 18*24*60*60*1000 + 3*60*60*1000) >= 18*24*60*60*1000 ||
            Math.abs(new Date().getTime() - endDate.getTime() + 18*24*60*60*1000 + 3*60*60*1000) >= 18*24*60*60*1000) {
            throw createHttpError(400, "Date is too far in the future or past or dates are not 3h in advance from now.");
        }

        const deltaTime = endDate.getTime() - beginDate.getTime();

        if(deltaTime < 0) {
            throw createHttpError(400, "BeginDate should be before EndDate.");
        }

        if(deltaTime < 30*60*1000 || deltaTime > 2*60*60*1000) {
            throw createHttpError(400, "Incorrect event duration.");
        }

        const resp = await GoogleCalendar.Instance.events.insert({
            calendarId: env.GOOGLE_CALENDARID, 
            // sendUpdates: "all",
            requestBody: {
                start: {
                    dateTime: beginDate.toISOString(),
                },
                end: {
                    dateTime: endDate.toISOString(),
                },
                summary: discordId,
            } });
            
        const newEvent: LessonEvent = {
            id: resp.data.id,
            discordId: resp.data.summary,
            startDate: resp.data.start?.dateTime,
            endDate: resp.data.end?.dateTime
        }

        eventsCache.get(beginDate.toISOString().split("T")[0])?.push(resp.data);

        res.status(200).json(newEvent);
    } catch(error) {
        next(error);
    }
    
};

export const deleteEvent : RequestHandler = async (req,res,next) => {
    const id = req.params.id;
    const startDate = new Date(req.params.startDate);

    try {
        if(!id) {
            throw createHttpError(400, "Invalid id.");
        }
        if(!startDate) {
            throw createHttpError(400, "Invalid startDate.");
        }

        const ev = await GoogleCalendar.Instance.events.get({
            calendarId: env.GOOGLE_CALENDARID,
            eventId: id
        });

        if(ev.data.summary !== req.user?.discordId) {
            throw createHttpError(403, "Forbidden access.");
        }

        const resp = await GoogleCalendar.Instance.events.delete({
            calendarId: env.GOOGLE_CALENDARID, 
            eventId: id,
            // sendUpdates: "all",
        });

        if(resp.status === 410) {
            throw createHttpError(410, "Resource has been deleted.");
        }

        if(resp.status !== 204) {
            throw createHttpError(500, "Unidentified error ocurred.");
        }

        if(ev) {
            const cacheKey = ev.data.start!.dateTime!.split("T")[0];
            const foundList = eventsCache.get(cacheKey);
            if(foundList) {
                eventsCache.set(cacheKey, foundList.filter(elem => elem.id != ev.data.id));
            }
        }

        res.sendStatus(204);

    } catch (error) {
        next(error);
    }
}