import type { userOtps } from '@/database/schema/schema';

export type UserOtp = typeof userOtps.$inferSelect;
export type InsertUserOtp = typeof userOtps.$inferInsert;
