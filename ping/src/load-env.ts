import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import path from 'path';

const EnvList = ['JWT_SECRET'] as const;

type EnvName = typeof EnvList[number];

dotenv.config({ path: path.resolve(process.cwd(), '.env.dev') });

export const checkEnv = () => {
  EnvList.forEach((envName) => {
    if (!process.env[envName]) throw new Error(`Missing ${envName}`);
  });
};

export const getEnv = (envName: EnvName) => {
  const val = process.env[envName];

  if (!val) throw new Error('Missing env');

  return val;
};
