import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to restrict access to specific IP addresses.
 * Useful for securing webhooks or external integrations.
 */
export const ipWhitelist = (req: Request, res: Response, next: NextFunction) => {
  const allowedIps = (process.env.ALLOWED_EXTERNAL_IPS || '').split(',').map(ip => ip.trim());
  
  // If no IPs are configured, we skip enforcement but log a warning in development
  if (allowedIps.length === 0 || (allowedIps.length === 1 && allowedIps[0] === '')) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[SECURITY] IP Whitelist is empty. Allowing all requests to external endpoint.');
    }
    return next();
  }

  const clientIp = req.ip || req.socket.remoteAddress;

  if (clientIp && (allowedIps.includes(clientIp) || allowedIps.includes('::ffff:' + clientIp))) {
    next();
  } else {
    console.warn(`[SECURITY] Blocked request from unauthorized IP: ${clientIp}`);
    res.status(403).json({ success: false, message: 'Access denied: Unauthorized IP' });
  }
};
