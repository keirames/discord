import { envServer, envSchema } from './schema';
import type { map, ZodFormattedError } from 'zod';

const _env = envSchema.safeParse(envServer);

const formatErrors = (errors: ZodFormattedError<Map<string, string>, string>) =>
  Object.entries(errors)
    .map(([name, value]) => {
      if (value && '_errors' in value)
        return `${name}: ${value._errors.join(', ')}\n`;
    })
    .filter(Boolean);

if (!_env.success) {
  console.error(
    '❌ Invalid environment variables:\n',
    ...formatErrors(_env.error.format())
  );
  throw new Error('Invalid environment variables');
}

export const env = { ..._env.data };
