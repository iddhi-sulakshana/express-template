import { HTTP_STATUS } from '@/core';
import { ApiError, type DataResponse } from '@/types';
import type { EmailSignupDto, EmailSignupResponseDto } from '../dto';
import { UserRepository } from '@/database/repositories';
import { hashPassword } from '@/utils';

const userRepository = new UserRepository();

export async function emailSignupService(
  data: EmailSignupDto,
): Promise<DataResponse<EmailSignupResponseDto>> {
  const { email, password, name, userType } = data;

  // 1. Check if user already exists
  const user = await userRepository.findByEmail(email);

  if (user) {
    throw new ApiError('Credentials already exists', HTTP_STATUS.BAD_REQUEST);
  }

  // 2. Hash the password
  const hashedPassword = await hashPassword(password);

  // 3. Create the user
  const newUser = await userRepository.create({
    email,
    passwordHash: hashedPassword,
    userType,
    // TODO: Uncomment this when we have a verification email
    // userStatus: 'PENDING',
    userStatus: 'ACTIVE',
  });

  // 4. Send verification email
  // await sendVerificationEmail(newUser.email);

  // 5. Return the user
  const response: EmailSignupResponseDto = {
    id: newUser.id!,
    email: newUser.email!,
    name,
    userType: newUser.userType,
    userStatus: newUser.userStatus,
  };

  return {
    message: 'Email signup successful',
    status: HTTP_STATUS.OK,
    data: response,
  };
}

export async function mobileSignupService(): Promise<DataResponse<any>> {
  throw new ApiError('Not Implemented', HTTP_STATUS.NOT_IMPLEMENTED);
}

export async function googleSignupService(): Promise<DataResponse<any>> {
  throw new ApiError('Not Implemented', HTTP_STATUS.NOT_IMPLEMENTED);
}
