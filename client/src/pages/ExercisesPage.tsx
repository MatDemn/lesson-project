import React, { useEffect } from 'react';
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import { Exercise as ExerciseModel } from '../models/exercise';
import * as ExercisesApi from '../network/exercises_api';
import Exercise from '../components/Exercise';
import styles from '../styles/ExercisesPage.module.css';
import AddEditExerciseDialog from '../components/dialogs/AddEditExerciseDialog';
import ExerciseBar from '../components/partials/ExerciseBar';
import PaginatorBar from '../components/partials/PaginatorBar';
import { Loader } from 'three';

const ExercisesPage = () => {

  const [isExercisesLoading, setIsExerciseLoading] = React.useState(false);
  const [exercises,setExercises] = React.useState<ExerciseModel[]>([]);
  const [pageId,setPageId] = React.useState(1);
  const [elemCount,setElemCount] = React.useState(10);
  const [pageCount,setPageCount] = React.useState(1);

  useEffect(() => {
    async function loadExercises() {
      try {
        setIsExerciseLoading(true);
        const exercisesResponse = await ExercisesApi.fetchExercises({pageId, elemCount});
        setExercises(exercisesResponse.exercises);
        setPageCount(Math.ceil(exercisesResponse.total/elemCount));
        setIsExerciseLoading(false);
      } catch (error) {
        console.error(error);
        alert(error);
      }
    }
    loadExercises();
  }, [pageId]);

  const exampledesc = 
  "This is some example description, very very long one: \
  Lorem Ipsum is simply dummy text of the printing and typesetting industry. \
  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, \
  when an unknown printer took a galley of type and scrambled it to make a type specimen book.\
  It has survived not only five centuries, but also the leap into electronic typesetting, \
  remaining essentially unchanged. It was popularised in the 1960s with the release \
  of Letraset sheets containing Lorem Ipsum passages, \
  and more recently with desktop publishing software like Aldus PageMaker including \
  versions of Lorem Ipsum.\
  This is some example description, very very long one: \
  Lorem Ipsum is simply dummy text of the printing and typesetting industry. \
  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, \
  when an unknown printer took a galley of type and scrambled it to make a type specimen book.\
  It has survived not only five centuries, but also the leap into electronic typesetting, \
  remaining essentially unchanged. It was popularised in the 1960s with the release \
  of Letraset sheets containing Lorem Ipsum passages, \
  and more recently with desktop publishing software like Aldus PageMaker including \
  versions of Lorem Ipsum.";

  return ( 
    <>
    {isExercisesLoading && <Spinner />}
    {!isExercisesLoading && exercises.map(exerc => (
      <ExerciseBar 
        id={exerc._id} 
        title={exerc.title} 
        difficulty={exerc.difficulty} 
        description={exerc.description}
        tags={exerc.tags || []}
      />
    ))}
    {!isExercisesLoading && 
      <PaginatorBar currentPageId={pageId} totalPageCount={pageCount} changePage={setPageId}/> 
    }
    </>
  );
}
 
export default ExercisesPage;