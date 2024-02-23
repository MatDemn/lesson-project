import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Exercise as ExerciseModel } from '../models/exercise';
import * as ExercisesApi from '../network/exercises_api';
import React from "react";
import { Button, Spinner } from "react-bootstrap";
import exerciseStyle from "../styles/Exercise.module.css";
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faInfinity, faSignature, IconDefinition, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty, faKeyboard } from '@fortawesome/free-regular-svg-icons';
import TagPill from "../components/partials/TagPill";
import { ReactSpoiler } from "react-simple-spoiler";
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import AddEditExerciseDialog from "../components/dialogs/AddEditExerciseDialog";
import GeneralDialog from "../components/partials/GeneralDialog";
import rehypeRaw from "rehype-raw";
import ErrorCode from "../components/partials/ErrorCode";
import { HTTPError } from "../models/httpError";
import { DiscordUser } from "../models/discordUser";
import { HttpAPIError } from "../errors/http_errors";

interface ExercisePageProps {
    loggedUser: DiscordUser | null,
}

const ExercisePage = ({ loggedUser }: ExercisePageProps) => {
    const [exercise, setExercise] = React.useState<ExerciseModel | null>(null);
    const { id } = useParams();
    const [isLoading, setIsLoading] = React.useState(false);
    const [showEditExerciseDialog, setShowEditExerciseDialog] = React.useState(false);
    const [showDeleteExerciseDialog, setShowDeleteExerciseDialog] = React.useState(false);
    const [currentError, setCurrentError] = React.useState<HTTPError|null>(null);

    const keyMap: Record<string, IconDefinition> = {
        computerScience: faKeyboard,
        maths: faInfinity,
        other: faSignature,
        default: faQuestion
    };

    useEffect(() => {
        async function loadExercise() {
            try {
                setCurrentError(null);
                setIsLoading(true);
                if (!id) return;
                const exercise = await ExercisesApi.fetchExercise(id);
                setExercise(exercise);
                setIsLoading(false);
            } catch (error: any) {
                if(error instanceof HttpAPIError) {
                    setCurrentError({status: error.status, message: error?.message});
                }
                else {
                    setCurrentError({status: 500, message: error?.message});
                }
            }
            finally{
                setIsLoading(false);
            }

        }
        loadExercise();
    }, []);

    return (
        <div>
            {isLoading && <Spinner animation='border' variant='primary' />}
            {!!currentError &&
                <div className={exerciseStyle.exerciseCard}>
                    <ErrorCode errorCodeNumber={currentError.status} errorDescription={currentError.message} />
                </div>}
            {!isLoading && !currentError && exercise &&
                <div className={exerciseStyle.exerciseCard}>
                    <div className={exerciseStyle.topBar}>
                        <div className={exerciseStyle.title}>
                            {exercise?.title}
                        </div>
                        <div className={exerciseStyle.courseType}>
                            <FontAwesomeIcon icon={keyMap[exercise!.courseType] || keyMap.default} />
                        </div>
                        <div className={exerciseStyle.difficulty}>
                            <div className={exerciseStyle.difficultyBar}>
                                {[1, 2, 3, 4, 5].map(i => <FontAwesomeIcon icon={i <= exercise!.difficulty ? faStar : faStarEmpty} size="2x" color="yellow" />)}
                            </div>
                        </div>
                    </div>
                    <div className={exerciseStyle.description}>
                        <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                            {exercise?.description}
                        </Markdown>
                    </div>
                    <div className={exerciseStyle.image}>
                        {exercise?.imagePath && <img src={exercise?.imagePath} alt="" />}
                    </div>
                    {!!exercise?.rightAnswer &&
                        <div className={exerciseStyle.rightAnwser}>
                            <div className={exerciseStyle.rightAnwserContent}>
                                Rozwiązanie:
                            </div>
                            <ReactSpoiler noOfLines={0} showMoreComponent="Pokaż" showLessComponent="Ukryj">
                                {exercise?.rightAnswer}
                            </ReactSpoiler>
                        </div>}
                    <div className={exerciseStyle.createdAt}>
                        Utworzono: {exercise?.createdAt}
                    </div>
                    <div className={exerciseStyle.tags}>
                        {exercise?.tags?.map(elem => <TagPill content={elem} />)}
                    </div>
                    {loggedUser && loggedUser.isAdmin
                        && <div className={exerciseStyle.adminBar}>
                            <Button id={exerciseStyle.editExercise} onClick={() => setShowEditExerciseDialog(true)}><FontAwesomeIcon icon={faPencil} /></Button>
                            <Button id={exerciseStyle.deleteExercise} onClick={() => setShowDeleteExerciseDialog(true)}><FontAwesomeIcon icon={faTrash} /></Button>
                        </div>}
                </div>}
            {showEditExerciseDialog && exercise &&
                <AddEditExerciseDialog
                    exerciseToEdit={exercise}
                    onDismiss={() => setShowEditExerciseDialog(false)}
                    onExerciseSaved={(newExercise) => {
                        setExercise(newExercise);
                        setShowEditExerciseDialog(false);
                    }} />}
            {showDeleteExerciseDialog &&
                <GeneralDialog
                    title="Czy na pewno usunąć zadanie?"
                    confirmLabel="Tak"
                    dismissLabel="Nie"
                    onDismiss={() => setShowDeleteExerciseDialog(false)}
                    onConfirm={() => setShowDeleteExerciseDialog(false)} />}
        </div>
    );
};

export default ExercisePage;