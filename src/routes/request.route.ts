import { Router } from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import {
  createMentorshipRequest,
  respondToMentorshipRequest,
  getReceivedRequests,
} from '../controllers/mentorshipRequest.controller';

const router = Router();

router.post('/', authenticateJWT, createMentorshipRequest);
router.post('/:id/respond', authenticateJWT, respondToMentorshipRequest);
router.get('/received', authenticateJWT, getReceivedRequests);

export default router;
