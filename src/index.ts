// src/index.ts
import express from 'express';
import cors from 'cors'; // ✅ CORS is needed for frontend requests

import authRoutes from './routes/auth';
import requestRoutes from './routes/request.route';
import sessionRoutes from './routes/session.route';
import availabilityRoutes from './routes/availability.route';
import feedbackRoutes from './routes/feedback.route';
import testRoutes from './routes/test.route';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // ✅ allow Vite dev server
  credentials: true,
}));

app.use(express.json());

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/test', testRoutes);

// ✅ Health check
app.get('/ping', (_req, res) => {
  res.send('pong');
});

// ✅ Server startup
app.listen(3000, () => {
  console.log('✅ Server running at http://localhost:3000');
});
