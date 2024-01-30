import styles from "../styles/Exercise.module.css";
import {Card} from "react-bootstrap";
import { Exercise as ExerciseModel } from "../models/exercise";
import { formatDate } from "../utils/formatDate";

interface ExerciseProps {
    exercise: ExerciseModel,
    className?: string,
}

const Exercise = ({exercise, className }: ExerciseProps) => {
    const {
        title,
        description,
        imagePath,
        difficulty,
        courseType,
        rightAnswer,
        tags,
        createdAt,
        updatedAt
    } = exercise;

    let createdUpdatedText: string;
    if(updatedAt > createdAt) {
        createdUpdatedText = "Updated: " + formatDate(updatedAt);
    }
    else {
        createdUpdatedText = "Created: " + formatDate(createdAt);
    }

    return (
        <Card className={`${styles.exerciseCard} ${className}`}>
            <Card.Body className={styles.exerciseBody}>
                <Card.Title>
                    {title}
                </Card.Title>
                <Card.Text className={styles.exerciseText}>
                    {description}
                </Card.Text>
            </Card.Body>
            <Card.Footer className="text-muted">
                    {createdUpdatedText}
                </Card.Footer>
        </Card>
    );
};

export default Exercise;