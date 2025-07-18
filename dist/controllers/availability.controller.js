"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAvailability = exports.getAvailabilities = exports.createAvailability = void 0;
const client_1 = require("../prisma/client");
const createAvailability = async (req, res) => {
    try {
        const { userId, dayOfWeek, startTime, endTime } = req.body;
        const availability = await client_1.prisma.availability.create({
            data: { userId, dayOfWeek, startTime, endTime },
        });
        return res.status(201).json(availability);
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.createAvailability = createAvailability;
const getAvailabilities = async (req, res) => {
    try {
        const { userId } = req.params;
        const availabilities = await client_1.prisma.availability.findMany({
            where: { userId },
            orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
        });
        return res.json(availabilities);
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getAvailabilities = getAvailabilities;
const deleteAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await client_1.prisma.availability.delete({
            where: { id },
        });
        return res.json(deleted);
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.deleteAvailability = deleteAvailability;
