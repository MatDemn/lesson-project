import styles from "../styles/Exercise.module.css";
import {Card} from "react-bootstrap";
import { LessonEvent as LessonEventModel } from "../models/lessonEvent";
import { start } from "repl";

interface LessonEventProps {
    lessonEvent: LessonEventModel,
}

function getWeekName(dateString: string) : string {
    const weekNames = 
        ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"] 
    return weekNames[new Date(dateString).getDay()];
}

function getTime(dateString: string) : string {
    return new Date(dateString).toLocaleTimeString('pl', {hour12: false, hour:"2-digit", minute: "2-digit"});
}

const LessonEvent = ({lessonEvent}: LessonEventProps) => {
    const startDate = new Date(lessonEvent.startDate);
    const startWeekDayName = getWeekName(lessonEvent.startDate);
    const startTime = getTime(lessonEvent.startDate);
    const endTime = getTime(lessonEvent.endDate);
    return (
        <Card>
            <Card.Body className={styles.exerciseBody}>
                <Card.Title>
                    {startDate.getDate()}.{startDate.getMonth()+1}.{startDate.getFullYear()} ({startWeekDayName}): {startTime}-{endTime}
                </Card.Title>
                <Card.Text className={styles.exerciseText}>
                    {lessonEvent.discordId}
                </Card.Text>
            </Card.Body>
            <Card.Footer className="text-muted">
            {lessonEvent.startDate} --- {lessonEvent.endDate}
            </Card.Footer>
        </Card>
    );
};

export default LessonEvent;