import mongoose from 'mongoose';
import { env } from '../config/env';
import { connectDatabase } from '../config/database';

/**
 * Shared helper for standalone scripts (seeds, migrations, etc.)
 * Provides environment logging, connection management, and a production safety delay.
 */
export async function runScript(
  name: string,
  fn: () => Promise<void>
): Promise<void> {
  console.log(`\n▶ Running script: ${name}`);
  console.log(`  Database: ${env.DB_NAME}`);
  console.log(`  Environment: ${env.NODE_ENV}\n`);

  // Safety prompt in production
  if (env.NODE_ENV === 'production') {
    console.warn('⚠️  WARNING: You are running a script against a PRODUCTION database.');
    console.warn(`   Target DB: ${env.DB_NAME}`);
    console.warn('   You have 5 seconds to cancel (Ctrl+C)...\n');
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  await connectDatabase();

  try {
    const start = Date.now();
    await fn();
    const duration = Date.now() - start;
    console.log(`\n✅ Script "${name}" completed successfully in ${duration}ms.`);
  } catch (err: any) {
    console.error(`\n❌ Script "${name}" failed:`, err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Database disconnected.\n');
  }
}
