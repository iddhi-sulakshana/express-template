import type { UserStatus } from '@/database/entities';
import type { UserType } from '@/database/entities';

export type ValidateUserResponseDto = {
  id: string;
  email: string;
  userType: UserType;
  userStatus: UserStatus;
};
