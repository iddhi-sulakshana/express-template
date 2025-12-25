import { z, ZodError } from 'zod';
import { jwtExpiryRegex, type JwtTokenExpiry } from '@/types/jwt.types';

const envSchema = z.object({
  // General Related
  NODE_ENV: z.enum(['development', 'production', 'staging']).optional().default('development'),
  PORT: z.coerce.number().default(3000),
  APP_URL: z.url().optional().default('http://localhost:3000'),
  APP_PREFIX: z.string().optional().default('api/v1'),
  FRONTEND_URL: z.url().optional().default('http://localhost:5000'),

  // Database Related
  DATABASE_URL: z.url(),
  REDIS_URL: z.url(),

  // JWT Related
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().regex(jwtExpiryRegex, 'Invalid JWT expiry format').default('15M'),
  JWT_REFRESH_SECRET: z.string(),
  JWT_REFRESH_EXPIRES_IN: z
    .string()
    .regex(jwtExpiryRegex, 'Invalid refresh JWT expiry format')
    .default('7d'),
});

export default class ENV {
  static NODE_ENV: 'development' | 'production' | 'staging';
  static PORT: number;
  static APP_URL: string;
  static APP_PREFIX: string;
  static FRONTEND_URL: string;
  static DATABASE_URL: string;
  static REDIS_URL: string;
  static JWT_SECRET: string;
  static JWT_EXPIRES_IN: JwtTokenExpiry;
  static JWT_REFRESH_SECRET: string;
  static JWT_REFRESH_EXPIRES_IN: JwtTokenExpiry;

  public static configEnvironment() {
    // bun will automatically load the environment variables from the .env file
    // so will use zod schema to validate the environment variables
    try {
      const parsed = envSchema.parse(process.env);

      // set the environment variable to use in the application
      // this will reduce the garbage values are feeding in to the system

      // General Related
      this.NODE_ENV = parsed.NODE_ENV;
      this.PORT = parsed.PORT;
      this.APP_URL = parsed.APP_URL;
      this.APP_PREFIX = parsed.APP_PREFIX;
      this.FRONTEND_URL = parsed.FRONTEND_URL;

      // Database Related
      this.DATABASE_URL = parsed.DATABASE_URL;
      this.REDIS_URL = parsed.REDIS_URL;

      // JWT Related
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
      console.log(`Environment variables loaded and configured`);
      console.log();
    }
  }
}

ENV.configEnvironment();
