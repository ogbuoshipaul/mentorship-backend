"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./routes/auth"));
const request_route_1 = __importDefault(require("./routes/request.route"));
const session_route_1 = __importDefault(require("./routes/session.route"));
const availability_route_1 = __importDefault(require("./routes/availability.route"));
const feedback_route_1 = __importDefault(require("./routes/feedback.route"));
const test_route_1 = __importDefault(require("./routes/test.route"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/requests', request_route_1.default);
app.use('/api/sessions', session_route_1.default);
app.use('/api/availability', availability_route_1.default);
app.use('/api/feedback', feedback_route_1.default);
app.use('/api/test', test_route_1.default);
// Health check
app.get('/ping', (_req, res) => {
    res.send('pong');
});
// Server startup
app.listen(3000, () => {
    console.log('✅ Server running at http://localhost:3000');
});
exports.default = app;
