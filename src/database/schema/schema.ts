import {
  pgTable,
  boolean,
  timestamp,
  unique,
  uuid,
  varchar,
  geometry,
  pgEnum,
  index,
  date,
  integer,
} from 'drizzle-orm/pg-core';

export const userTypeEnum = pgEnum('user_type', ['CUSTOMER', 'VENDOR', 'EMPLOYEE', 'SUPER_ADMIN']);

export const userStatusEnum = pgEnum('user_status', [
  'ACTIVE',
  'INACTIVE',
  'SUSPENDED',
  'DELETED',
  'PENDING',
]);

export const genderEnum = pgEnum('gender', ['MALE', 'FEMALE', 'OTHER']);

// Users Table
export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }),
    passwordHash: varchar('password_hash', { length: 255 }),
    countryCode: varchar('country_code', { length: 10 }), // e.g., '1', '91', '44'
    contactNumber: varchar('contact_number', { length: 20 }), // e.g., '7012345678'
    userType: userTypeEnum('user_type').notNull(),
    userStatus: userStatusEnum('user_status').notNull(),
    googleId: varchar('google_id', { length: 255 }),
    googleVerified: boolean('google_verified').default(false),
    emailVerified: boolean('email_verified').default(false),
    phoneVerified: boolean('phone_verified').default(false),

    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp()
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    // Unique indexes
    emailUserTypeIdx: unique('email_user_type_unique').on(table.email, table.userType),
    phoneUserTypeIdx: unique('phone_user_type_unique').on(
      table.countryCode,
      table.contactNumber,
      table.userType,
    ),
    googleUserTypeIdx: unique('google_user_type_unique').on(table.googleId, table.userType),
  }),
);

export const userLocations = pgTable(
  'user_locations',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    userId: uuid('user_id')
      .references(() => users.id)
      .notNull(),
    locationName: varchar('location_name', { length: 50 }),
    address: varchar('address', { length: 100 }),
    district: varchar('district', { length: 100 }),
    city: varchar('city', { length: 100 }),
    country: varchar('country', { length: 100 }),
    location: geometry('location', { type: 'point', mode: 'xy', srid: 4326 }), // PostGIS POINT for lat/lng
    geohash: varchar('geohash', { length: 10 }),
    defaultLocation: boolean('default_location').default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp()
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    // Spatial index for location queries
    spatialIdx: index('user_locations_spatial_idx').using('gist', table.location),
  }),
);

export const userDetails = pgTable('user_details', {
  userId: uuid('user_id')
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
  onesignalId: varchar('onesignal_id', { length: 255 }),
  timezone: varchar('timezone', { length: 50 }), // e.g., 'America/New_York' from the IANA timezone database
  referralCode: varchar('referral_code', { length: 50 }).unique(), // Unique referral code per user
  notificationEnabled: boolean('notification_enabled').default(false),
  isRegistered: boolean('is_registered'), // to check if the user is created or not (if salon create a new customer its false)
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const userOtps = pgTable('user_otps', {
  id: uuid('id').primaryKey().defaultRandom(),

  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  otpCode: varchar('otp_code', { length: 10 }), // numeric or alphanumeric OTP
  purpose: varchar('purpose', { length: 50 }), // e.g., 'phone_verification', 'password_reset'
  expiresAt: timestamp('expires_at'), // when OTP expires
  verified: boolean('verified').default(false),
  attempts: integer('attempts').default(0),
  channel: varchar('channel', { length: 20 }), // e.g., 'sms', 'email'
  usedAt: timestamp('used_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
