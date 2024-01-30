import { Component, ReactElement, useEffect } from "react";
import { LessonEvent as LessonEventModel } from "../models/lessonEvent";
import * as CalendarApi from '../network/googleCalendar_api';
import React from "react";
import { Button, Col, Form, Row, Spinner, Table } from "react-bootstrap";
import { DiscordUser } from "../models/discordUser";
import LessonEvent from "../components/LessonEvent";
import CalendarPageStyle from "../styles/CalendarPage.module.css";
import "../styles/CalendarPage.module.css";
import { useForm } from "react-hook-form";
import CalendarEvent, { EventType } from "../components/partials/CalendarEvent";

interface CalendarPageProps {
    loggedUser: DiscordUser | null,
}

export interface TimeSlot {
    startTime: Date,
    endTime: Date,
    offsetPercent: string,
    slotSpan: number,
    eventType: EventType,
}

interface CalendarEventInputForm {
    eventDate: string,
    eventTime: string,
}

const CalendarPage = ({loggedUser} : CalendarPageProps) => {
    const [eventsLoading, setEventsLoading] = React.useState(false);
    const [allLessonEvents,setAllLessonEvents] = React.useState<LessonEventModel[]>([]);
    const [busySlots, setBusySlots] = React.useState<Map<string,TimeSlot>>(new Map());
    const [choosenSlots, setChoosenSlots] = React.useState<Map<string,TimeSlot>>(new Map());
    const [choosenWeekIndex, setChoosenWeekIndex] = React.useState(0);
    const [newTimeSlotsCount, setNewTimeSlotsCount] = React.useState(0);

    const { setError, clearErrors, register, handleSubmit, formState : {errors, isSubmitting } } = useForm<CalendarEventInputForm>({
        defaultValues: {
            eventDate: new Date().toDateString(),
            eventTime: "16:30",
        }
    });

    const startHour = 16;
    const endHour = 22;
    const startMinutes = 0;
    const endMinutes = 0;

    const timeStep = 60; // in minutes
    const timeBufor = 15; // in minutes

    const timeSlots = generateTimeSlots();

    const startDay = new Date();
    const endDay = new Date();
    endDay.setDate(startDay.getDate()+6);

    const weekDates = generateWeekDates(startDay, 7);
    
    function generateTimeSlots() {
        const timeSlots: string[] = [];

        let currentHour = startHour;
        let currentMinute = startMinutes;
        
        const endTotal = endHour*100 + endMinutes;
        let currentTotal = startHour*100+startMinutes;
        while(currentTotal<endTotal) {
            let elem = `${currentHour}<sup>${(currentMinute < 10 ? "0" : "") + currentMinute}</sup>-`;
            currentMinute += timeStep;
            currentHour += (currentMinute / 60) | 0; // hacky way to convert float to int 
            currentMinute %= 60;
            elem += `${currentHour}<sup>${(currentMinute < 10 ? "0" : "") + currentMinute}</sup>`;
            timeSlots.push(elem);

            currentTotal = currentHour*100 + currentMinute;
        }
        return timeSlots;
    }

    function generateWeekDates(startDate: Date, dayCount: number): Date[] {
        if(dayCount <= 0) return [startDate];
        
        let result: Date[] = [];
        for(let i = 0; i<dayCount; i++) {
            const newDate = new Date(startDate);
            newDate.setDate(newDate.getDate()+i);
            result.push(newDate);
        }
        return result;
    }

    function createSlot(startDate: Date, endDate: Date, eventType: EventType) {
        const parentDate = new Date(startDate);
        const offset = new Date(parentDate);
        parentDate.setTime(Math.floor((parentDate.getTime()-startMinutes*60*1000) / (timeStep*60*1000)) * timeStep*60*1000 + startMinutes*60*1000);
        let slotDayIndex = Math.round((startDate.getTime() - startDay.getTime()) / (1000*3600 * 24));
        const slotDayStart = new Date(startDate);
        slotDayStart.setHours(startHour);
        slotDayStart.setMinutes(startMinutes);
        const uniqueId = slotDayIndex+"|"+Math.floor(((startDate.getTime()-slotDayStart.getTime()) / (1000*60) / timeStep));
        busySlots.set(uniqueId, {startTime: startDate, endTime: endDate, offsetPercent: getTopPercent(parentDate, startDate)+"%", slotSpan: getTimeStepSpan(startDate,endDate), eventType: eventType});
    }

    function createBreak(slotEndDate: Date) {
        const endDate = new Date(slotEndDate.getTime()+timeBufor*1000*60);
        createSlot(slotEndDate, endDate, EventType.Break);
    }

    function getTopPercent(parentDate: Date, childDate: Date): number {
        const difference = Math.abs(childDate.getTime() - parentDate.getTime());
        console.log(parentDate + " " + childDate + "|" + difference);
        return Math.round(difference/(60*1000)/timeStep * 100)/100*100;
    }
    function getTimeStepSpan(beginDate: Date, endDate: Date): number {
        return (endDate.getTime() - beginDate.getTime())/(1000*3600);
    }

    function onSubmit(input: CalendarEventInputForm) {
        alert(input.eventDate.substring(5)+"|"+input.eventTime);
    }

    useEffect(() => {
        async function loadEvents() {
            try {
                if(!loggedUser) {
                    return;
                }
                setEventsLoading(true);
                const currentWeekLessonEvents = await CalendarApi.fetchAllCurrentWeek();
                setAllLessonEvents(currentWeekLessonEvents);
                
                currentWeekLessonEvents.map(lessonEv => {createSlot(new Date(lessonEv.startDate), new Date(lessonEv.endDate), lessonEv.discordId === loggedUser.discordId ? EventType.Reserved : EventType.Busy); createBreak(new Date(lessonEv.endDate))});
            }
            catch(error) {
                console.error(error);
                alert(error);
            }
            finally{
                setEventsLoading(false);
            }
        }
        loadEvents();
    }, [loggedUser]);

    return ( 
        <>
            {eventsLoading ? <Spinner className={CalendarPageStyle.calendarLoader} /> :  
            <div>
                <h1>Dostępność czasowa ({startDay.getDate()+"."+String(startDay.getMonth()+1).padStart(2, '0')}-{endDay.getDate()+"."+String(endDay.getMonth()+1).padStart(2, '0')}):</h1>
                <Table striped bordered>
                    <thead>
                        <tr>
                            {weekDates?.map(date => <th className={"text-center"}>{date.getDate()+"."+String(date.getMonth()+1).padStart(2, '0')}</th>)}
                        </tr>
                    </thead>
                    
                    <tbody>
                        {
                            timeSlots.map((slot,slotIndex) => (
                            <tr>
                                {weekDates.map((weekDate,weekIndex) => 
                                    <td className={"text-center"} style={{position: "relative"}}>
                                        {<span>
                                            <span dangerouslySetInnerHTML={{ __html: slot}}>
                                            </span>
                                            {busySlots.has(weekIndex+"|"+slotIndex) && 
                                            <CalendarEvent topSpace={busySlots.get(weekIndex+"|"+slotIndex)!.offsetPercent} heightSize={(busySlots.get(weekIndex+"|"+slotIndex)!.slotSpan * 100*(60/timeStep)) + "%"} timeSlot={busySlots.get(weekIndex+"|"+slotIndex)!}/>}
                                        </span>}
                                    </td>)}
                            </tr>))
                        }
                    </tbody>
                </Table>
                <h1>Dodaj nowy termin:</h1>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Control
                        type="date"
                        {...register("eventDate")}
                    />
                    <Form.Control
                        type="time"
                        step="60"
                        min={startHour+":"+startMinutes.toString().padStart(2, "0")}
                        max={endHour+":"+endMinutes.toString().padStart(2, "0")}
                        placeholder="16:30"
                        {...register("eventTime")}
                    />
                    <Button type="submit">Dodaj termin</Button>
                </Form>
                
                <h1>Wybrane terminy:</h1>
                {/* {

                    for()

    choosenSlots.forEach((value, key, map) => (
        <span>{slot.startTime.getTime()}, {slot.endTime.getTime()}</span>
    ))
                } */}
            </div>
            }
        </>
    );
}
 
export default CalendarPage;