import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Exercise as ExerciseModel } from '../models/exercise';
import * as ExercisesApi from '../network/exercises_api';
import React from "react";
import { Button, Container, Spinner } from "react-bootstrap";
import exerciseStyle from "../styles/Exercise.module.css";
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faInfinity, faSignature, IconDefinition, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty, faKeyboard} from '@fortawesome/free-regular-svg-icons';
import TagPill from "../components/partials/TagPill";
import { ReactSpoiler } from "react-simple-spoiler";
import ExerciseBar from "../components/partials/ExerciseBar";
import { DiscordUser } from "../models/discordUser";
import FaButton from "../components/singleComponents/faButton";
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import AddEditExerciseDialog from "../components/AddEditExerciseDialog";
import GeneralDialog from "../components/partials/GeneralDialog";

interface ExercisePageProps {
    loggedUser: DiscordUser | null,
  }

const ExercisePage = ({loggedUser}: ExercisePageProps) => {
    const [exercise,setExercise] = React.useState<ExerciseModel|null>(null);
    const {id} = useParams();
    const [isLoading,setIsLoading] = React.useState(false);
    const [showError,setShowError] = React.useState(false);
    const [showEditExerciseDialog, setShowEditExerciseDialog] = React.useState(false);
    const [showDeleteExerciseDialog, setShowDeleteExerciseDialog] = React.useState(false);

    const keyMap: Record<string, IconDefinition> = {
        computerScience: faKeyboard,
        maths: faInfinity,
        other: faSignature,
        default: faQuestion
    };

    useEffect(() => {
        async function loadExercise() {
          try {
            setShowError(false);
            setIsLoading(true);
            if(!id) return;
            const exercise = await ExercisesApi.fetchExercise(id);
            setExercise(exercise);
            setIsLoading(false);
          } catch (error) {
            setShowError(true);
            setIsLoading(false);
            console.error(error);
            //alert(error);
          }
          
        }
        loadExercise();
      }, []);

    return ( 
        <div>
            {isLoading &&<Spinner animation='border' variant='primary' />}
            {showError &&
                <div className={exerciseStyle.exerciseCard}>
                    This is an error...
                </div>
            }
            {!isLoading && !showError && exercise &&
            <div className={exerciseStyle.exerciseCard}>
                <div className={exerciseStyle.topBar}> 
                    <div className={exerciseStyle.title}>
                        {exercise?.title}
                    </div>
                    <div className={exerciseStyle.courseType}> 
                        <FontAwesomeIcon icon ={keyMap[exercise!.courseType] || keyMap.default} />
                    </div>
                    <div className={exerciseStyle.difficulty}> 
                        <div className={exerciseStyle.difficultyBar}>
                            {[1,2,3,4,5].map(i => <FontAwesomeIcon icon={i<=exercise!.difficulty ? faStar : faStarEmpty} size="2x" color="yellow"/>)}
                        </div>
                    </div>
                </div>
                <div className={exerciseStyle.description}> 
                    {exercise?.description}
                </div>
                <div className={exerciseStyle.createdAt}> 
                    createdAt: {exercise?.createdAt}
                </div>
                <div className={exerciseStyle.image}> 
                    {exercise?.imagePath && <img src={exercise?.imagePath} alt=""/>}
                </div>
                <div className={exerciseStyle.rightAnwser}> 
                    <div className={exerciseStyle.rightAnwserContent}>
                        Rozwiązanie:
                    </div>
                    <ReactSpoiler noOfLines={0} showMoreComponent="Pokaż" showLessComponent="Ukryj">
                        {exercise?.rightAnswer}
                    </ReactSpoiler>
                </div>
                <div className={exerciseStyle.tags}> 
                    {exercise?.tags?.map(elem => <TagPill content={elem}/>)}
                </div>
                <div className={exerciseStyle.id}> 
                    {exercise?._id}
                </div>
                {loggedUser && loggedUser.isAdmin 
                && <div className={exerciseStyle.adminBar}> 
                    <Button id={exerciseStyle.editExercise} onClick={() => setShowEditExerciseDialog(true)}><FontAwesomeIcon icon={faPencil}/></Button>
                    <Button id={exerciseStyle.deleteExercise} onClick={() => setShowDeleteExerciseDialog(true)}><FontAwesomeIcon icon={faTrash}/></Button>
                </div>}
            </div>
            }
            { showEditExerciseDialog && exercise &&
                <AddEditExerciseDialog 
                    exerciseToEdit={exercise}
                    onDismiss={() => setShowEditExerciseDialog(false)}
                    onExerciseSaved={(newExercise) => {
                        setExercise(newExercise);
                        setShowEditExerciseDialog(false);
                    }}
                />
            }
            { showDeleteExerciseDialog && 
                <GeneralDialog 
                    title="Czy na pewno usunąć zadanie?"
                    confirmLabel="Tak"
                    dismissLabel="Nie"
                    onDismiss={() => setShowDeleteExerciseDialog(false)}
                    onConfirm={() => setShowDeleteExerciseDialog(false)}
                />
            }
        </div> 
    );
}
 
export default ExercisePage;