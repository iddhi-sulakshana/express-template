import type { UserStatus, UserType } from '@/database/entities';
import z from 'zod';

export interface EmailSigninResponseDto {
  id: string;
  email: string;
  userType: UserType;
  userStatus: UserStatus;
}

export const emailSigninSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

export type EmailSigninDto = z.infer<typeof emailSigninSchema>;
