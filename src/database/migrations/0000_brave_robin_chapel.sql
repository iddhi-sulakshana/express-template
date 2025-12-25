CREATE TYPE "public"."gender" AS ENUM('MALE', 'FEMALE', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED', 'PENDING');--> statement-breakpoint
CREATE TYPE "public"."user_type" AS ENUM('SUPER_ADMIN');--> statement-breakpoint
CREATE TABLE "user_details" (
	"user_id" integer PRIMARY KEY NOT NULL,
	"first_name" varchar(50),
	"middle_name" varchar(50),
	"last_name" varchar(50),
	"nickname" varchar(100),
	"gender" "gender",
	"birth_date" date,
	"profile_image" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_details_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255),
	"password_hash" varchar(255),
	"user_type" "user_type" NOT NULL,
	"user_status" "user_status" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "email_user_type_unique" UNIQUE("email","user_type")
);
--> statement-breakpoint
ALTER TABLE "user_details" ADD CONSTRAINT "user_details_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "user_type_idx" ON "users" USING btree ("user_type");