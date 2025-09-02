import type { userLocations } from '@/database/schema/schema';

export type UserLocation = typeof userLocations.$inferSelect;
export type InsertUserLocation = typeof userLocations.$inferInsert;
