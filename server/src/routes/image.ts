import express from 'express'
import * as ImageController from '../controllers/image';
import { requiresAdmin } from '../middleware/auth';

const router = express.Router()

//Read

router.get('/secureURL', requiresAdmin, ImageController.getSecureImagePostURL);

// Create
//router.post('/', ExerciseController.createExercise);

// Update
//router.patch('/:id', ExerciseController.updateExercise);

// Delete
router.delete('/:imageId', requiresAdmin, ImageController.delImage);

export default router;





