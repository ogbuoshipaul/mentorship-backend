"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionFeedback = exports.submitFeedback = exports.bookSession = void 0;
const prisma_1 = __importDefault(require("../prisma"));
// Book a new mentorship session (by mentee)
const bookSession = async (req, res) => {
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
        const newSession = await prisma_1.default.mentorshipSession.create({
            data: {
                mentorId,
                menteeId,
                scheduledAt: scheduledDate,
                status: "PENDING",
            },
        });
        res.status(201).json({ message: 'Session booked successfully', session: newSession });
    }
    catch (error) {
        console.error('Error booking session:', error);
        res.status(500).json({ error: 'Could not book session' });
    }
};
exports.bookSession = bookSession;
// Submit or update feedback for a session
const submitFeedback = async (req, res) => {
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
        const session = await prisma_1.default.mentorshipSession.findUnique({
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
        const existingFeedback = await prisma_1.default.feedback.findUnique({
            where: { sessionId },
        });
        let feedback;
        if (existingFeedback) {
            // Update feedback
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
        res.json({ message: 'Feedback submitted', feedback });
    }
    catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ error: 'Could not submit feedback' });
    }
};
exports.submitFeedback = submitFeedback;
// Get feedback by sessionId
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
        res.status(500).json({ error: 'Could not fetch feedback' });
    }
};
exports.getSessionFeedback = getSessionFeedback;
