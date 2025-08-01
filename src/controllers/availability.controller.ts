// src/controllers/availability.controller.ts
import { Request, Response } from 'express';
import { prisma } from '../prisma/client';

export const createAvailability = async (req: Request, res: Response) => {
  try {
    const { userId, dayOfWeek, startTime, endTime } = req.body;
    const availability = await prisma.availability.create({
      data: { userId, dayOfWeek, startTime, endTime },
    });
    return res.status(201).json(availability);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAvailabilities = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const availabilities = await prisma.availability.findMany({
      where: { userId },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });
    return res.json(availabilities);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteAvailability = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await prisma.availability.delete({
      where: { id },
    });
    return res.json(deleted);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
