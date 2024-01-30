import { Button, Nav, NavLink } from "react-bootstrap";
import exerciseBarStyles from "../../styles/ExerciseBar.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';
import TagPill from "./TagPill";
import { useNavigate } from "react-router-dom";

interface ExerciseBarProps {
    id: string,
    title: string,
    difficulty: number,
    description: string,
    tags: string[]
}

const ExerciseBar = ({id, title, difficulty, description, tags}: ExerciseBarProps) => {
    description = description.substring(0, 600) + "...";
    
    const navigate = useNavigate();
    function redirectToExercise(id: string) {
        let path = `/exercises/${id}`;
        navigate(path);
    }

    function getDifficultyColor(difficulty: number) {
        if(difficulty<3) return "green";
        else if(difficulty<5) return "yellow";
        return "red";
    }

    return ( 
        <div className={exerciseBarStyles.mainContent} onClick={() => redirectToExercise(id)}>
            <div className={exerciseBarStyles.topBar}>
                <div className={exerciseBarStyles.title}>
                    {title}
                </div>
                <div className={exerciseBarStyles.difficultyBar}>
                    {[1,2,3,4,5].map(i =>  <FontAwesomeIcon icon={i<=difficulty ? faStar : faStarEmpty} size="2x" color={getDifficultyColor(difficulty)}/>)}
                </div>
            </div>
            <div className={exerciseBarStyles.description}>
                {description}
            </div>
            <div className={exerciseBarStyles.tags}>
                {tags.slice(0, 10).map(elem => <TagPill content={elem} />)}
            </div>
        </div>
     );
}
 
export default ExerciseBar;