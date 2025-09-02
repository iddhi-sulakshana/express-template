import { z, ZodError } from 'zod';
import { config } from 'dotenv-safe';
import { jwtExpiryRegex, type JwtTokenExpiry } from '@/types/jwt.types';
import path from 'path';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'staging']).optional().default('development'),
  PORT: z
    .string()
    .refine((val) => !isNaN(Number(val)), {
      message: 'PORT must be a number',
    })
    .transform((val) => Number(val))
    .default(3000),

  DATABASE_URL: z.url(),
  REDIS_URL: z.url(),

  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().regex(jwtExpiryRegex, 'Invalid JWT expiry format').default('15M'),
  JWT_REFRESH_SECRET: z.string(),
  JWT_REFRESH_EXPIRES_IN: z
    .string()
    .regex(jwtExpiryRegex, 'Invalid refresh JWT expiry format')
    .default('7d'),
  JWT_COOKIE_NAME: z.string().default('jwt'),
});

export default class ENV {
  static NODE_ENV: 'development' | 'production' | 'staging';
  static PORT: number;
  static DATABASE_URL: string;
  static REDIS_URL: string;
  static JWT_SECRET: string;
  static JWT_EXPIRES_IN: JwtTokenExpiry;
  static JWT_REFRESH_SECRET: string;
  static JWT_REFRESH_EXPIRES_IN: JwtTokenExpiry;

  public static configEnvironment() {
    // constructing the path to the .env file located in root directory of the application
    const envPath = path.join(path.resolve(), '.env');
    const envExamplePath = path.join(path.resolve(), '.env.example');

    // load environment variables from the .env file
    try {
      config({ path: envPath, example: envExamplePath });
    } catch (error) {
      console.error('Error loading .env file', error);
      process.exit(1);
    }

    // validate the environment variables using zod
    try {
      const parsed = envSchema.parse(process.env);
      this.NODE_ENV = parsed.NODE_ENV;
      this.PORT = parsed.PORT;
      this.DATABASE_URL = parsed.DATABASE_URL;
      this.REDIS_URL = parsed.REDIS_URL;
      this.JWT_SECRET = parsed.JWT_SECRET;
      this.JWT_EXPIRES_IN = parsed.JWT_EXPIRES_IN as JwtTokenExpiry;
      this.JWT_REFRESH_SECRET = parsed.JWT_REFRESH_SECRET;
      this.JWT_REFRESH_EXPIRES_IN = parsed.JWT_REFRESH_EXPIRES_IN as JwtTokenExpiry;
    } catch (error) {
      const issues = (error as ZodError).issues.map((issue) => {
        const path = issue.path.join('.') || 'body';
        const message = issue.message.split(':')[1]?.trim() || issue.message;
        const code = issue.code;
        return {
          path,
          message,
          code,
        };
      });
      console.log(issues);
      process.exit(1);
    }

    // / Logging information if running in the development environment
    if (process.env.NODE_ENV === 'development') {
      console.log('\n🚧 Node running as Development Environment 🚧\n');
      console.log(`Enviroment Variables Loaded: ${envPath}`);
      console.log();
    }
  }
}
