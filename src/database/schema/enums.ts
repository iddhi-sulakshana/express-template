import { pgEnum } from 'drizzle-orm/pg-core';
import { EnumValues } from '../enums';

export const userTypeEnum = pgEnum('user_type', EnumValues.UserTypeValues);
export const userStatusEnum = pgEnum('user_status', EnumValues.UserStatusValues);
export const genderEnum = pgEnum('gender', EnumValues.GenderValues);
