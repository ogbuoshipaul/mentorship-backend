import { Request, Response } from 'express';
import prisma from '../utils/prismaClient';

export const getAllMentors = async (req: Request, res: Response) => {
  try {
    const mentors = await prisma.user.findMany({
      where: { role: 'mentor' },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        skills: true,
      },
    });

    res.status(200).json(mentors);
  } catch {
    res.status(500).json({ message: 'Failed to fetch mentors' });
  }
};
