import { Router } from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import { submitFeedback, getSessionFeedback } from '../controllers/feedback.controller';

const router = Router();

// Submit or update feedback for a session
router.post('/', authenticateJWT, submitFeedback);

// Get feedback by sessionId
router.get('/:sessionId', authenticateJWT, getSessionFeedback);

export default router;
