import type { genderEnum, userDetails } from '@/database/schema/schema';

export type UserDetails = typeof userDetails.$inferSelect;
export type InsertUserDetails = typeof userDetails.$inferInsert;
export type Gender = (typeof genderEnum.enumValues)[number];
