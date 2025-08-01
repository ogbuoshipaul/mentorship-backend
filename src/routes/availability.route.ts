// src/routes/availability.route.ts
import { Router } from 'express';
import * as availabilityController from '../controllers/availability.controller';


const router = Router();

router.post('/', availabilityController.createAvailability);
router.get('/:userId', availabilityController.getAvailabilities);
router.delete('/:id', availabilityController.deleteAvailability);

export default router;
