import { generateRefreshTokens, verifyRefreshToken } from '@/utils';
import type { RefreshTokenDto, RefreshTokenResponseDto } from '../dto';
import { ApiError, type DataResponse } from '@/types';
import { HTTP_STATUS } from '@/core';
import { UserRepository } from '@/database/repositories';

const userRepository = new UserRepository();

// TODO: Add rate limiting to the refresh token endpoint
export async function refreshTokenService(
  data: RefreshTokenDto,
): Promise<DataResponse<RefreshTokenResponseDto>> {
  const { refreshToken } = data;

  // 1. Verify the refresh token
  const payload = await verifyRefreshToken(refreshToken);
  if (!payload) {
    throw new ApiError('Invalid refresh token', HTTP_STATUS.UNAUTHORIZED);
  }

  // 2. Get the user from the database and check if the user is active
  const user = await userRepository.findById(payload.id);

  if (!user || user.userStatus !== 'ACTIVE') {
    throw new ApiError('User not found', HTTP_STATUS.NOT_FOUND);
  }

  // 3. Generate a new access token
  const { accessToken, refreshToken: newRefreshToken } = await generateRefreshTokens(payload, {
    id: user.id,
    userType: user.userType,
    userStatus: user.userStatus,
  });

  return {
    message: 'Refresh token rotated successfully',
    status: HTTP_STATUS.OK,
    data: 'Success',
    headers: [
      {
        name: 'x-access-token',
        value: accessToken,
      },
      {
        name: 'x-refresh-token',
        value: newRefreshToken,
      },
    ],
  };
}
