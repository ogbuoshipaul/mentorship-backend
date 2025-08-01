import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Define type for decoded JWT
interface JwtPayload {
  userId: string;
  role: 'MENTOR' | 'MENTEE';
}

// Extend Request with user info
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

// Middleware: Verify token and attach user info
export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authorization header missing or malformed' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    (req as AuthRequest).user = decoded;
    next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};
