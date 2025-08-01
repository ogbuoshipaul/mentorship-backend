"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post('/register', (req, res) => {
    console.log('📨 Register route hit');
    (0, authController_1.registerUser)(req, res);
});
router.post('/login', (req, res) => {
    (0, authController_1.loginUser)(req, res);
});
router.get('/test', (_req, res) => {
    res.send('✅ Auth route is working');
});
// ✅ Fix TypeScript error by using type assertion inside handler
router.get('/me', authMiddleware_1.authenticateJWT, (req, res) => {
    const authReq = req;
    if (!authReq.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    res.json({
        userId: authReq.user.userId,
        role: authReq.user.role,
    });
});
exports.default = router;
