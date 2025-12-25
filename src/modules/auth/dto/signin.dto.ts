import type { EnumTypes } from '@/database/enums';
import z from 'zod';

export interface EmailSigninResponseDto {
  id: number;
  email: string;
  userType: EnumTypes.UserType;
  userStatus: EnumTypes.UserStatus;
}

export const emailSigninSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

export type EmailSigninDto = z.infer<typeof emailSigninSchema>;
