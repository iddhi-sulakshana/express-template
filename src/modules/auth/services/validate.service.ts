import { HTTP_STATUS } from '@/core';
import { UserRepository } from '@/database/repositories';
import { ApiError, type DataResponse } from '@/types';
import type { ValidateUserResponseDto } from '../dto';
const userRepository = new UserRepository();

export async function validateUserService(
  userId: number,
): Promise<DataResponse<ValidateUserResponseDto>> {
  const user = await userRepository.findById(userId);
  if (!user || user.userStatus !== 'ACTIVE') {
    throw new ApiError('User not found', HTTP_STATUS.NOT_FOUND);
  }

  return {
    message: 'User validated successfully',
    status: HTTP_STATUS.OK,
    data: {
      id: user.id!,
      email: user.email!,
      userType: user.userType,
      userStatus: user.userStatus,
    },
  };
}
