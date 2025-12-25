import type { EnumTypes } from '@/database/enums';
import { UserTypeValues } from '@/database/enums/values.enums';
import z from 'zod';

export interface EmailSignupResponseDto {
  id: number;
  email: string;
  name: string;
  userType: EnumTypes.UserType;
  userStatus: EnumTypes.UserStatus;
}

export const emailSignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(3),
  userType: z.enum(UserTypeValues),
});

export type EmailSignupDto = z.infer<typeof emailSignupSchema>;
