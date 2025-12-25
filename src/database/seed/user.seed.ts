import { UserRepository, UserDetailsRepository } from '@/database/repositories';
import type { User, UserDetails } from '../entities';
import { hashPassword } from '@/utils';

const userRepository = new UserRepository();
const userDetailsRepository = new UserDetailsRepository();

const hashedPassword = await hashPassword('admin');

const predefinedUsers: {
  user: User;
  userDetails: UserDetails;
}[] = [
  {
    user: {
      id: 1,
      email: 'admin@admin.com',
      passwordHash: hashedPassword,
      userType: 'SUPER_ADMIN',
      userStatus: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    userDetails: {
      userId: 1,
      firstName: 'Admin',
      middleName: null,
      nickname: null,
      gender: 'MALE',
      birthDate: null,
      profileImage: null,
      lastName: 'Admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  //  ...
];

export default async function seedUsers(): Promise<void> {
  try {
    console.log('🌱 Seeding users...');

    for (const user of predefinedUsers) {
      await userRepository.create(user.user);
      await userDetailsRepository.create(user.userDetails);
    }

    console.log('🌳 Users seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
  }
}
