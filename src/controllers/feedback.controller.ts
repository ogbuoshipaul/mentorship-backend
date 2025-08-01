// src/controllers/feedback.controller.ts
import { Request, Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middleware/authMiddleware';

// Submit or update feedback for a mentorship session
export const submitFeedback = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { sessionId } = req.params;
    const { rating, comment } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      res.status(400).json({ error: 'Rating must be a number between 1 and 5' });
      return;
    }

    // Verify the session exists and user is part of it (mentor or mentee)
    const session = await prisma.mentorshipSession.findUnique({
      where: { id: sessionId },
      include: { mentor: true, mentee: true },
    });

    if (!session) {
      res.status(404).json({ error: 'Mentorship session not found' });
      return;
    }

    if (session.mentorId !== userId && session.menteeId !== userId) {
      res.status(403).json({ error: 'Unauthorized to provide feedback for this session' });
      return;
    }

    // Check if feedback exists for this session
    const existingFeedback = await prisma.feedback.findUnique({
      where: { sessionId },
    });

    let feedback;
    if (existingFeedback) {
      // Update existing feedback
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

    res.json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
};

// Get feedback details for a mentorship session
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
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
};
