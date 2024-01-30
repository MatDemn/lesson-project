import { TimeSlot } from "../../pages/CalendarPage";
import calendarEventStyle from "../../styles/CalendarEvent.module.css";

export enum EventType {
    Busy = 0,
    Choosen = 1,
    Reserved = 2,
    Break = 3,
}

interface CalendarEventProps {
    timeSlot: TimeSlot,
    topSpace: string,
    heightSize: string,
}

const CalendarEvent = ({timeSlot,topSpace,heightSize}: CalendarEventProps) => {
    
    function getEventStyleClass(eventType: EventType): string {
        switch(eventType) {
            case EventType.Busy:
                return calendarEventStyle.eventBusy;
            case EventType.Choosen:
                return calendarEventStyle.eventChoosen;
                case EventType.Reserved:
                return calendarEventStyle.eventReserved;
            case EventType.Break:
                return calendarEventStyle.eventBreak;
        }
    }

    function getTimeContent({startTime, endTime, offsetPercent, slotSpan, eventType}: TimeSlot): string {
        switch(eventType) {
            case EventType.Busy:
            case EventType.Choosen:
            case EventType.Reserved:
            case EventType.Break:
                return startTime.getHours().toString().padStart(2, '0')+"<sup>"+startTime.getMinutes().toString().padStart(2, '0')+"</sup>-"+endTime.getHours().toString().padStart(2, '0')+"<sup>"+endTime.getMinutes().toString().padStart(2, '0')+"</sup>";

        }
        
    }
    
    return ( 
        <div className={calendarEventStyle.container+" "+getEventStyleClass(timeSlot.eventType)} style={{top: topSpace, height: heightSize}} dangerouslySetInnerHTML={{__html: getTimeContent(timeSlot)}}>
        </div> 
    );
}
 
export default CalendarEvent;