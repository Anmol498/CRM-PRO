import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { useQueryClient } from '@tanstack/react-query';
import api, { lastApiCallTime } from '../api/client';

interface AuthContextType {
    user: User | null;
    login: (userData: any) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const queryClient = useQueryClient();

    // Verify authentication on mount via /auth/me (cookie-based)
    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const { data } = await api.get('/auth/me');
                setUser(data);
            } catch (error) {
                setUser(null);
                // Cleanup
            } finally {
                setIsLoading(false);
            }
        };

        verifyAuth();
    }, []);

    // Smart presence tracking (Idle heartbeat & Goodbye signal)
    useEffect(() => {
        if (!user?.id) return;

        const IDLE_THRESHOLD = 4 * 60 * 1000; 
        const CHECK_INTERVAL = 60 * 1000;     
        const IDLE_PING_KEY = 'crm_last_idle_ping';

        const idleCheck = setInterval(() => {
            if (document.visibilityState !== 'visible') return;
            const timeSinceLastCall = Date.now() - lastApiCallTime;
            if (timeSinceLastCall < IDLE_THRESHOLD) return;
            const lastPing = parseInt(localStorage.getItem(IDLE_PING_KEY) || '0', 10);
            if (Date.now() - lastPing < IDLE_THRESHOLD) return;

            localStorage.setItem(IDLE_PING_KEY, String(Date.now()));
            api.post('/users/heartbeat').catch(() => {});
        }, CHECK_INTERVAL);

        const TAB_COUNT_KEY = 'crm_active_tabs';
        const currentCount = parseInt(localStorage.getItem(TAB_COUNT_KEY) || '0', 10);
        localStorage.setItem(TAB_COUNT_KEY, String(currentCount + 1));

        const handleGoodbye = () => {
            const count = parseInt(localStorage.getItem(TAB_COUNT_KEY) || '1', 10);
            const newCount = Math.max(0, count - 1);
            localStorage.setItem(TAB_COUNT_KEY, String(newCount));

            if (newCount === 0) {
                const payload = JSON.stringify({ userId: user?.id });
                const blob = new Blob([payload], { type: 'application/json' });
                const apiBase = (api.defaults.baseURL || '').replace(/\/api$/, '');
                navigator.sendBeacon(`${apiBase}/api/users/offline`, blob);
            }
        };

        window.addEventListener('beforeunload', handleGoodbye);

        return () => {
            clearInterval(idleCheck);
            window.removeEventListener('beforeunload', handleGoodbye);
            const count = parseInt(localStorage.getItem(TAB_COUNT_KEY) || '1', 10);
            localStorage.setItem(TAB_COUNT_KEY, String(Math.max(0, count - 1)));
        };
    }, [user?.id]);

    const login = (userData: any) => {
        setUser(userData);
        // Token is now set in HTTP-only cookie by backend
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setUser(null);
            queryClient.clear();
            window.location.href = '/login';
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
