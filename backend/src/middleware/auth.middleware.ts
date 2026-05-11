import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { verifyToken } from '../utils/jwt';
import User from '../models/User.model';

// Throttle lastSeen updates: max once per 60s per user (in-memory)
const lastSeenCache = new Map<string, number>();
const LAST_SEEN_THROTTLE = 60 * 1000; // 60 seconds

const touchLastSeen = (userId: string) => {
  const now = Date.now();
  const lastTouch = lastSeenCache.get(userId) || 0;
  if (now - lastTouch > LAST_SEEN_THROTTLE) {
    lastSeenCache.set(userId, now);
    User.updateOne({ _id: userId }, { $set: { lastSeen: new Date() } }).exec().catch(() => {});
  }
};

export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;

    // 1. Check cookies first (most secure)
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } 
    // 2. Fallback to Authorization header
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = verifyToken(token);
        req.user = decoded;
        touchLastSeen(decoded.id);
        next();
      } catch (error) {
        res.status(401);
        throw new Error('Not authorized, token failed');
      }
    } else {
      res.status(401);
      throw new Error('Not authorized, no token');
    }
  }
);

export const adminGuard = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }
};
