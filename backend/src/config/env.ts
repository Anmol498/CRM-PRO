import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

// Define all permitted DB names
const PERMITTED_DB_NAMES = ['CRM_Prod', 'CRM_Dev', 'TESTDATA', 'travel_crm'] as const;
type PermittedDB = typeof PERMITTED_DB_NAMES[number];

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string().url(),
  DB_NAME: z.string()
    .min(1, 'DB_NAME is required')
    .refine(
      (name): name is PermittedDB => (PERMITTED_DB_NAMES as readonly string[]).includes(name),
      (name) => ({
        message: `DB_NAME "${name}" is not permitted. Allowed values: ${PERMITTED_DB_NAMES.join(', ')}`
      })
    ),
  JWT_SECRET: z.string(),
  BASE_URL: z.string().default('http://localhost:5000'),
  EXTERNAL_API_KEY: z.string().optional(),
  FRONTEND_URL: z.string().optional(),
  WEB_CONCURRENCY: z.string().default('1'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const env = _env.data;




