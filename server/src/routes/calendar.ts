import express from 'express'
import * as CalendarController from '../controllers/calendar';
//import { requiresAuth } from '../utils/assertIsDefined';

const router = express.Router()

//Read
router.get('/', CalendarController.getAllCurrentWeekEvents );

router.get('/:discordId', CalendarController.getCurrentWeekEvents);

// Create
//router.post('/', ExerciseController.createExercise);

// Update
//router.patch('/:id', ExerciseController.updateExercise);

// Delete
//router.delete('/:id', ExerciseController.deleteExercise);

export default router;