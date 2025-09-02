import { HTTP_STATUS } from '@/core';
import { ApiError, type DataResponse } from '@/types';
import type { EmailSigninDto, EmailSigninResponseDto } from '../dto/signin.dto';
import { UserRepository } from '@/database/repositories';
import { generateLoginTokens, verifyPassword } from '@/utils';

const userRepository = new UserRepository();

export async function emailSigninService(
  data: EmailSigninDto,
): Promise<DataResponse<EmailSigninResponseDto>> {
  const { email, password } = data;

  const user = await userRepository.findByEmail(email);

  // 1. Check if user exists
  if (!user) {
    throw new ApiError('User not found', HTTP_STATUS.NOT_FOUND);
  }

  // 2. Check if password is correct
  const isPasswordCorrect = await verifyPassword(password, user.passwordHash!);
  if (!isPasswordCorrect) {
    throw new ApiError('Invalid password', HTTP_STATUS.BAD_REQUEST);
  }

  // 3. Check if user is pending
  if (user.userStatus === 'PENDING') {
    throw new ApiError('User is pending', HTTP_STATUS.BAD_REQUEST);
  }

  // 4. Check if user is active
  if (user.userStatus !== 'ACTIVE') {
    throw new ApiError('User is not active', HTTP_STATUS.BAD_REQUEST);
  }

  // 5. Generate access and refresh tokens
  const { accessToken, refreshToken } = generateLoginTokens({
    id: user.id,
    userType: user.userType,
    userStatus: user.userStatus,
  });

  return {
    message: 'User signed in successfully',
    status: HTTP_STATUS.OK,
    data: {
      id: user.id!,
      email: user.email!,
      userType: user.userType,
      userStatus: user.userStatus,
    },
    headers: [
      {
        name: 'x-access-token',
        value: accessToken,
      },
      {
        name: 'x-refresh-token',
        value: refreshToken,
      },
    ],
  };
}

export async function mobileSigninService(): Promise<DataResponse<any>> {
  throw new ApiError('Not Implemented', HTTP_STATUS.NOT_IMPLEMENTED);
}

export async function googleSigninService(): Promise<DataResponse<any>> {
  throw new ApiError('Not Implemented', HTTP_STATUS.NOT_IMPLEMENTED);
}
