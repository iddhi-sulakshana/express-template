import { userTypeEnum, userStatusEnum, genderEnum } from './enums';

import {
  pgTable,
  timestamp,
  unique,
  varchar,
  date,
  index,
  serial,
  integer,
} from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';

// Reusables
const trackingTimestamps = {
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
};

// Users Table
export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }),
    passwordHash: varchar('password_hash', { length: 255 }),
    userType: userTypeEnum('user_type').notNull(),
    userStatus: userStatusEnum('user_status').notNull(),

    ...trackingTimestamps,
  },
  (table) => ({
    // Unique constraints
    emailUserTypeIdx: unique('email_user_type_unique').on(table.email, table.userType),

    // Indexes
    emailIdx: index('email_idx').on(table.email),
    userTypeIdx: index('user_type_idx').on(table.userType),
  }),
);

export const usersRelations = relations(users, ({ one }) => ({
  userDetails: one(userDetails, {
    fields: [users.id],
    references: [userDetails.userId],
  }),
}));

export const userDetails = pgTable('user_details', {
  userId: integer('user_id')
    .primaryKey()
    .references(() => users.id)
    .unique(),
  firstName: varchar('first_name', { length: 50 }),
  middleName: varchar('middle_name', { length: 50 }),
  lastName: varchar('last_name', { length: 50 }),
  nickname: varchar('nickname', { length: 100 }),
  gender: genderEnum('gender'),
  birthDate: date('birth_date'),
  profileImage: varchar('profile_image', { length: 255 }),

  ...trackingTimestamps,
});
