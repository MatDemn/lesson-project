import express from 'express'
import * as ExerciseController from '../controllers/exercise';
import { requiresAdmin } from '../middleware/auth';

const router = express.Router()

//Read

router.get('/', ExerciseController.getExercises);

router.get('/:pageId/:elemCount', ExerciseController.getExercises);

router.get('/:id', ExerciseController.getExercise);

// Create
router.post('/', requiresAdmin, ExerciseController.createExercise);

// Update
router.patch('/:id', requiresAdmin, ExerciseController.updateExercise);

// Delete
router.delete('/:id', requiresAdmin, ExerciseController.deleteExercise);

export default router;