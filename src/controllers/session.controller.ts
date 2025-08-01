// src/controllers/session.controller.ts
import { Request, Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middleware/authMiddleware';

// Book a new mentorship session (by mentee)
export const bookSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const menteeId = req.user?.userId;
    const { mentorId, scheduledAt } = req.body;

    if (!mentorId || !scheduledAt) {
      res.status(400).json({ error: 'mentorId and scheduledAt are required' });
      return;
    }

    const scheduledDate = new Date(scheduledAt);
    if (isNaN(scheduledDate.getTime())) {
      res.status(400).json({ error: 'Invalid scheduledAt date format' });
      return;
    }

    if (!menteeId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const newSession = await prisma.mentorshipSession.create({
      data: {
        mentorId,
        menteeId,
        scheduledAt: scheduledDate,
        status: "PENDING",
      },
    });

    res.status(201).json({ message: 'Session booked successfully', session: newSession });
  } catch (error) {
    console.error('Error booking session:', error);
    res.status(500).json({ error: 'Could not book session' });
  }
};

// Submit or update feedback for a session
export const submitFeedback = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { sessionId } = req.params;
    const { rating, comment } = req.body;

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      res.status(400).json({ error: 'rating must be a number between 1 and 5' });
      return;
    }

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Verify session exists and user is mentor or mentee
    const session = await prisma.mentorshipSession.findUnique({
      where: { id: sessionId },
      include: { mentor: true, mentee: true },
    });

    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    if (session.mentorId !== userId && session.menteeId !== userId) {
      res.status(403).json({ error: 'Unauthorized to provide feedback for this session' });
      return;
    }

    // Check if feedback exists for session
    const existingFeedback = await prisma.feedback.findUnique({
      where: { sessionId },
    });

    let feedback;
    if (existingFeedback) {
      // Update feedback
      feedback = await prisma.feedback.update({
        where: { sessionId },
        data: { rating, comment },
      });
    } else {
      // Create new feedback
      feedback = await prisma.feedback.create({
        data: { sessionId, rating, comment },
      });
    }

    res.json({ message: 'Feedback submitted', feedback });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Could not submit feedback' });
  }
};

// Get feedback by sessionId
export const getSessionFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;

    const feedback = await prisma.feedback.findUnique({
      where: { sessionId },
      include: {
        session: {
          select: {
            id: true,
            scheduledAt: true,
            mentor: { select: { id: true, name: true, email: true } },
            mentee: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    if (!feedback) {
      res.status(404).json({ error: 'Feedback not found for this session' });
      return;
    }

    res.json({ feedback });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Could not fetch feedback' });
  }
};
