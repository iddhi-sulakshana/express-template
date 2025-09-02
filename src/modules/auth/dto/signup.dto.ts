import type { UserStatus, UserType } from '@/database/entities';
import { userTypeEnum } from '@/database/schema/schema';
import z from 'zod';

export interface EmailSignupResponseDto {
  id: string;
  email: string;
  name: string;
  userType: UserType;
  userStatus: UserStatus;
}

export const emailSignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(3),
  userType: z.enum(userTypeEnum.enumValues),
});

export type EmailSignupDto = z.infer<typeof emailSignupSchema>;
