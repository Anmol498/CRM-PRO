import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/User.model';
import { loginSchema } from '../types';
import { matchPassword, needsUpgrade, hashPassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { createTimer } from '../utils/perfLogger';

import logger from '../utils/logger';

// @desc    Auth user & set cookie
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const t = createTimer('loginUser');
    const result = loginSchema.safeParse(req.body);
    t.mark('validate');

    if (!result.success) {
        t.end({ error: 'Invalid input' });
        res.status(400);
        throw new Error('Invalid input');
    }

    const { email, password } = result.data;

    const user = await User.findOne({ email })
        .select('passwordHash name email role groups')
        .lean();
    t.mark('dbQuery');

    if (user) {
        const isMatch = await matchPassword(password, user.passwordHash);
        t.mark('bcryptVerify');

        if (isMatch) {
            if (needsUpgrade(user.passwordHash)) {
                const newHash = await hashPassword(password);
                await User.findByIdAndUpdate(user._id, { passwordHash: newHash });
                logger.info(`[AUTH] Upgraded password hash rounds for ${user.email}`);
            }
            t.mark('passwordUpgradeCheck');

            await User.findByIdAndUpdate(user._id, {
                isOnline: true,
                lastSeen: new Date()
            });
            t.mark('dbUpdateStatus');

            const token = generateToken(user);
            
            // Set HTTP-only cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax', // Use lax for compatibility with open CORS if needed, or 'strict' if same-domain
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            t.end({ email: user.email, role: user.role });
            res.json({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                groups: user.groups,
                isOnline: true,
                token, // Still returning token for backward compatibility if needed, but primary is cookie
            });
            return;
        }
    }

    t.end({ error: 'Invalid credentials' });
    res.status(401);
    throw new Error('Invalid email or password');
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
    if (req.user) {
        await User.findByIdAndUpdate(req.user.id, {
            isOnline: false,
            lastSeen: new Date()
        });
    }

    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
    });

    res.json({ success: true, message: 'Logged out successfully' });
});

// @desc    Get current user info from token
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.user?.id).select('-passwordHash').lean();
    
    if (user) {
        res.json({
            ...user,
            id: user._id
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});
