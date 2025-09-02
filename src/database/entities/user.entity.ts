import type { users, userTypeEnum, userStatusEnum } from '@/database/schema/schema';

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type UserType = (typeof userTypeEnum.enumValues)[number];
export type UserStatus = (typeof userStatusEnum.enumValues)[number];
