// src/controllers/test.controller.ts
import { Request, Response } from 'express';
import { prisma } from '../prisma/client';

export const testDbConnection = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      message: '✅ Prisma is connected!',
      users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '❌ Failed to connect to the database.' });
  }
};
