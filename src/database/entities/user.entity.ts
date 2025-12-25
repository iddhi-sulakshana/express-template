import type { users } from '@/database/schema/schema';

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
