import { warmDropdownCache } from '../controllers/settings.controller';
import { warmCaches } from './cacheWarm';
import logger from './logger';

/**
 * Defers non-critical cache warming tasks to run after the server starts listening.
 * This prevents blocking the startup sequence and reduces cold-start latency.
 */
export async function warmAfterStart(): Promise<void> {
  // setImmediate ensures this runs after the current event loop tick
  // allowing the server.listen() callback to finish and the server to start accepting traffic.
  setImmediate(async () => {
    try {
      logger.info('[STARTUP] Starting background cache warming...');
      const start = Date.now();
      
      await Promise.all([
        warmDropdownCache(),
        warmCaches()
      ]);
      
      const duration = Date.now() - start;
      logger.info(`[STARTUP] Background cache warming complete in ${duration}ms.`);
    } catch (err: any) {
      // Non-fatal error - the app will still work but might be slightly slower for first requests
      logger.error(`[STARTUP] Cache warming failed (non-fatal): ${err.message}`);
    }
  });
}
