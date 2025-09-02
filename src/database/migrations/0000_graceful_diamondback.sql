CREATE TYPE "public"."gender" AS ENUM('MALE', 'FEMALE', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED', 'PENDING');--> statement-breakpoint
CREATE TYPE "public"."user_type" AS ENUM('CUSTOMER', 'VENDOR', 'EMPLOYEE', 'SUPER_ADMIN');--> statement-breakpoint
CREATE TABLE "user_details" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"first_name" varchar(50),
	"middle_name" varchar(50),
	"last_name" varchar(50),
	"nickname" varchar(100),
	"gender" "gender",
	"birth_date" date,
	"profile_image" varchar(255),
	"onesignal_id" varchar(255),
	"timezone" varchar(50),
	"referral_code" varchar(50),
	"notification_enabled" boolean DEFAULT false,
	"is_registered" boolean,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_details_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "user_details_referral_code_unique" UNIQUE("referral_code")
);
--> statement-breakpoint
CREATE TABLE "user_locations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"location_name" varchar(50),
	"address" varchar(100),
	"district" varchar(100),
	"city" varchar(100),
	"country" varchar(100),
	"location" geometry(point),
	"geohash" varchar(10),
	"default_location" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_otps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"otp_code" varchar(10),
	"purpose" varchar(50),
	"expires_at" timestamp,
	"verified" boolean DEFAULT false,
	"attempts" integer DEFAULT 0,
	"channel" varchar(20),
	"used_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255),
	"password_hash" varchar(255),
	"country_code" varchar(10),
	"contact_number" varchar(20),
	"user_type" "user_type" NOT NULL,
	"user_status" "user_status" NOT NULL,
	"google_id" varchar(255),
	"google_verified" boolean DEFAULT false,
	"email_verified" boolean DEFAULT false,
	"phone_verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "email_user_type_unique" UNIQUE("email","user_type"),
	CONSTRAINT "phone_user_type_unique" UNIQUE("country_code","contact_number","user_type"),
	CONSTRAINT "google_user_type_unique" UNIQUE("google_id","user_type")
);
--> statement-breakpoint
ALTER TABLE "user_details" ADD CONSTRAINT "user_details_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_locations" ADD CONSTRAINT "user_locations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_otps" ADD CONSTRAINT "user_otps_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_locations_spatial_idx" ON "user_locations" USING gist ("location");