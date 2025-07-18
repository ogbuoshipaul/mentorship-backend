"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReceivedRequests = exports.respondToMentorshipRequest = exports.createMentorshipRequest = void 0;
const prisma_1 = __importDefault(require("../prisma"));
// 📌 1. Create mentorship request (by mentee)
const createMentorshipRequest = async (req, res) => {
    try {
        const menteeId = req.user?.userId;
        const { mentorId } = req.body;
        if (!mentorId) {
            res.status(400).json({ error: 'mentorId is required' });
            return;
        }
        // Prevent duplicate request
        const existing = await prisma_1.default.mentorshipRequest.findFirst({
            where: { menteeId, mentorId },
        });
        if (existing) {
            res.status(409).json({ error: 'Mentorship request already sent' });
            return;
        }
        const newRequest = await prisma_1.default.mentorshipRequest.create({
            data: {
                menteeId,
                mentorId,
            },
        });
        res.status(201).json({ message: 'Mentorship request sent', request: newRequest });
    }
    catch (error) {
        console.error("❌ Error creating mentorship request:", error);
        res.status(500).json({ error: 'Could not create mentorship request' });
    }
};
exports.createMentorshipRequest = createMentorshipRequest;
// 📌 2. Mentor responds to request
const respondToMentorshipRequest = async (req, res) => {
    try {
        const mentorId = req.user?.userId;
        const { id } = req.params;
        const { action } = req.body; // "ACCEPTED" or "REJECTED"
        if (!['ACCEPTED', 'REJECTED'].includes(action)) {
            res.status(400).json({ error: 'Invalid action' });
            return;
        }
        const request = await prisma_1.default.mentorshipRequest.findUnique({ where: { id } });
        if (!request || request.mentorId !== mentorId) {
            res.status(403).json({ error: 'Unauthorized or request not found' });
            return;
        }
        const updated = await prisma_1.default.mentorshipRequest.update({
            where: { id },
            data: { status: action },
        });
        res.json({ message: `Request ${action.toLowerCase()}`, request: updated });
    }
    catch (error) {
        console.error("❌ Error responding to request:", error);
        res.status(500).json({ error: 'Could not update request status' });
    }
};
exports.respondToMentorshipRequest = respondToMentorshipRequest;
// 📌 3. Get all requests received by mentor
const getReceivedRequests = async (req, res) => {
    try {
        const mentorId = req.user?.userId;
        const requests = await prisma_1.default.mentorshipRequest.findMany({
            where: { mentorId },
            include: { mentee: true },
        });
        res.json({ requests });
    }
    catch (error) {
        console.error("❌ Error fetching received requests:", error);
        res.status(500).json({ error: 'Failed to fetch requests' });
    }
};
exports.getReceivedRequests = getReceivedRequests;
