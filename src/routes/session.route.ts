import { Router } from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import { bookSession, submitFeedback, getSessionFeedback } from '../controllers/session.controller';

const router = Router();

// Book a mentorship session
router.post('/', authenticateJWT, bookSession);

// Submit or update feedback for a session
router.post('/:sessionId/feedback', authenticateJWT, submitFeedback);

// Get feedback for a session
router.get('/:sessionId/feedback', authenticateJWT, getSessionFeedback);

export default router;
