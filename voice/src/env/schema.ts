import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({
  path:
    process.env.NODE_ENV === 'production'
      ? `${path.resolve(process.cwd(), '.env.prod')}`
      : `${path.resolve(process.cwd(), '.env.dev')}`,
});
console.log('load', process.env.BROKER);

export const envSchema = z.object({
  BROKER: z.string(),
});

export const envServer = {
  BROKER: process.env.BROKER,
};
