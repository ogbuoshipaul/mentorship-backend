import { Request, Response } from 'express';
import prisma from '../prisma';

// 📌 1. Create mentorship request (by mentee)
export const createMentorshipRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const menteeId = (req as any).user?.userId;
    const { mentorId } = req.body;

    if (!mentorId) {
      res.status(400).json({ error: 'mentorId is required' });
      return;
    }

    // Prevent duplicate request
    const existing = await prisma.mentorshipRequest.findFirst({
      where: { menteeId, mentorId },
    });

    if (existing) {
      res.status(409).json({ error: 'Mentorship request already sent' });
      return;
    }

    const newRequest = await prisma.mentorshipRequest.create({
      data: {
        menteeId,
        mentorId,
      },
    });

    res.status(201).json({ message: 'Mentorship request sent', request: newRequest });
  } catch (error) {
    console.error("❌ Error creating mentorship request:", error);
    res.status(500).json({ error: 'Could not create mentorship request' });
  }
};

// 📌 2. Mentor responds to request
export const respondToMentorshipRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const mentorId = (req as any).user?.userId;
    const { id } = req.params;
    const { action } = req.body; // "ACCEPTED" or "REJECTED"

    if (!['ACCEPTED', 'REJECTED'].includes(action)) {
      res.status(400).json({ error: 'Invalid action' });
      return;
    }

    const request = await prisma.mentorshipRequest.findUnique({ where: { id } });

    if (!request || request.mentorId !== mentorId) {
      res.status(403).json({ error: 'Unauthorized or request not found' });
      return;
    }

    const updated = await prisma.mentorshipRequest.update({
      where: { id },
      data: { status: action },
    });

    res.json({ message: `Request ${action.toLowerCase()}`, request: updated });
  } catch (error) {
    console.error("❌ Error responding to request:", error);
    res.status(500).json({ error: 'Could not update request status' });
  }
};

// 📌 3. Get all requests received by mentor
export const getReceivedRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const mentorId = (req as any).user?.userId;

    const requests = await prisma.mentorshipRequest.findMany({
      where: { mentorId },
      include: { mentee: true },
    });

    res.json({ requests });
  } catch (error) {
    console.error("❌ Error fetching received requests:", error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
};
