"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionFeedback = exports.submitFeedback = void 0;
const prisma_1 = __importDefault(require("../prisma"));
// Submit or update feedback for a mentorship session
const submitFeedback = async (req, res) => {
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
        const session = await prisma_1.default.mentorshipSession.findUnique({
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
        const existingFeedback = await prisma_1.default.feedback.findUnique({
            where: { sessionId },
        });
        let feedback;
        if (existingFeedback) {
            // Update existing feedback
            feedback = await prisma_1.default.feedback.update({
                where: { sessionId },
                data: { rating, comment },
            });
        }
        else {
            // Create new feedback
            feedback = await prisma_1.default.feedback.create({
                data: { sessionId, rating, comment },
            });
        }
        res.json({ message: 'Feedback submitted successfully', feedback });
    }
    catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ error: 'Failed to submit feedback' });
    }
};
exports.submitFeedback = submitFeedback;
// Get feedback details for a mentorship session
const getSessionFeedback = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const feedback = await prisma_1.default.feedback.findUnique({
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
    }
    catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ error: 'Failed to fetch feedback' });
    }
};
exports.getSessionFeedback = getSessionFeedback;
