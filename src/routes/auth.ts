import { Router, Request, Response } from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import { authenticateJWT, AuthRequest } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', (req: Request, res: Response) => {
  console.log('📨 Register route hit');
  registerUser(req, res);
});

router.post('/login', (req: Request, res: Response) => {
  loginUser(req, res);
});

router.get('/test', (_req: Request, res: Response) => {
  res.send('✅ Auth route is working');
});

// ✅ Fix TypeScript error by using type assertion inside handler
router.get('/me', authenticateJWT, (req: Request, res: Response) => {
  const authReq = req as AuthRequest;

  if (!authReq.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  res.json({
    userId: authReq.user.userId,
    role: authReq.user.role,
  });
});

export default router;
