import { Table } from "react-bootstrap";
import "../../styles/CalendarTable.module.css";
import CalendarTableStyle from "../../styles/CalendarTable.module.css";
import CalendarCellTitle from "../partials/CalendarCellTitle";
import { TimeSlot } from "../../pages/CalendarPage";
import CalendarEvent from "../partials/CalendarEvent";

interface CalendarTableProps {
    weekDates : Date[],
    timeSlots: string[],
    busySlots: Map<string,TimeSlot>,
    timeStep: number,
    onEventDelete: (arg0: TimeSlot) => void,
}

const CalendarTable = ({weekDates, timeSlots, busySlots, timeStep, onEventDelete} : CalendarTableProps) => {
    return ( 
    <>
        <div className="w-100" style={{overflowX: 'auto'}}>
                    <Table bordered className="mx-auto my-0">
                        <thead>
                            <tr>
                                {weekDates?.map((date, index) => <th key={"thead"+index.toString()} className={"text-center text-uppercase font-weight-bold"}>{date.getDate()+"."+String(date.getMonth()+1).padStart(2, '0')+" ("+date.toLocaleDateString("pl", { weekday: 'short' })+")"}</th>)}
                            </tr>
                        </thead>
                        
                        <tbody>
                            {
                                timeSlots.map((slot,slotIndex) => (
                                <tr key={"timeSlot "+slotIndex}>
                                    {weekDates.map((weekDate,weekIndex) => 
                                        <td key={"weekDates"+weekIndex} className={"p-0 align-content-space flex-column"} style={{position: "relative"}}>
                                            <div className="w-100 h-100 d-flex flex-column justify-content-between">
                                                <CalendarCellTitle content={slot.substring(0,5)} />
                                                {<span>
                                                    {busySlots.has(weekIndex+"|"+slotIndex) && 
                                                    <CalendarEvent topSpace={busySlots.get(weekIndex+"|"+slotIndex)!.offsetPercent} heightSize={(busySlots.get(weekIndex+"|"+slotIndex)!.slotSpan * 100*(60/timeStep)) + "%"} timeSlot={busySlots.get(weekIndex+"|"+slotIndex)!} onDelete={() => {onEventDelete(busySlots.get(weekIndex+"|"+slotIndex)!);}}/>}
                                                </span>}
                                                
                                            </div>
                                        </td>)}
                                </tr>))
                            }
                        </tbody>
                    </Table>
                </div>
    </> 
    );
}
 
export default CalendarTable;