"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const feedback_controller_1 = require("../controllers/feedback.controller");
const router = (0, express_1.Router)();
// Submit or update feedback for a session
router.post('/', authMiddleware_1.authenticateJWT, feedback_controller_1.submitFeedback);
// Get feedback by sessionId
router.get('/:sessionId', authMiddleware_1.authenticateJWT, feedback_controller_1.getSessionFeedback);
exports.default = router;
