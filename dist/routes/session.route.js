"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const session_controller_1 = require("../controllers/session.controller");
const router = (0, express_1.Router)();
// Book a mentorship session
router.post('/', authMiddleware_1.authenticateJWT, session_controller_1.bookSession);
// Submit or update feedback for a session
router.post('/:sessionId/feedback', authMiddleware_1.authenticateJWT, session_controller_1.submitFeedback);
// Get feedback for a session
router.get('/:sessionId/feedback', authMiddleware_1.authenticateJWT, session_controller_1.getSessionFeedback);
exports.default = router;
