import express from 'express'
import * as CalendarController from '../controllers/calendar';
import { requiresAuth } from '../middleware/auth';
//import { requiresAuth } from '../utils/assertIsDefined';

const router = express.Router()

//Read
router.get('/', CalendarController.getAllCurrentWeekEvents );

router.get('/:weekIndex', CalendarController.getCurrentWeekEvents);

router.get('/:beginDate/:endDate', CalendarController.checkForFreeSlot);

// Create
router.post('/', CalendarController.createEvent);

// Update
//router.patch('/:id', ExerciseController.updateExercise);

// Delete
router.delete('/:id/:startDate', requiresAuth, CalendarController.deleteEvent);

export default router;