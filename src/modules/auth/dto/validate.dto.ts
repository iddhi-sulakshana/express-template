import type { EnumTypes } from '@/database/enums';

export type ValidateUserResponseDto = {
  id: number;
  email: string;
  userType: EnumTypes.UserType;
  userStatus: EnumTypes.UserStatus;
};
