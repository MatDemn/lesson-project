import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { TimeSlot } from "../../pages/CalendarPage";
import calendarEventStyle from "../../styles/CalendarEvent.module.css";
import FaControlButton from "../singleComponents/FaControlButton";

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
    onDelete: () => void,
}

const CalendarEvent = ({timeSlot,topSpace,heightSize,onDelete}: CalendarEventProps) => {
    
    function getEventStyleClass(eventType: EventType): string {
        switch(eventType) {
            case EventType.Busy:
                return calendarEventStyle.eventBusy + " bg-light-danger";
            case EventType.Choosen:
                return calendarEventStyle.eventChoosen;
                case EventType.Reserved:
                return calendarEventStyle.eventReserved + " bg-light-warning";
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
                return startTime.getHours().toString().padStart(2, '0')+":"+startTime.getMinutes().toString().padStart(2, '0')+" "+endTime.getHours().toString().padStart(2, '0')+":"+endTime.getMinutes().toString().padStart(2, '0');

        }
        
    }
    
    return ( 
        <div className={calendarEventStyle.container+" "+getEventStyleClass(timeSlot.eventType)} style={{top: topSpace, height: heightSize}} >
            <div className={calendarEventStyle.mainContent}>
                <div className={calendarEventStyle.eventContent + " text-dark text-center"}>
                    {getTimeContent(timeSlot).split(" ").map(elem => <div className="w-100 rounded" key={elem}>{elem}</div>)}
                </div>
                {timeSlot.eventType === EventType.Reserved &&
                    <div className={calendarEventStyle.editBar}>
                        <FaControlButton className={`bg-danger text-white p-1 ${calendarEventStyle.controlButton}`} icon={faTrashCan} onClick={onDelete}/>
                    </div>
                }
            </div> 
        </div>
            
    );
}
 
export default CalendarEvent;