```sql
-- OK
Table users {
  user_id        uuid [pk, default: `uuid_generate_v4()`]
  email          varchar(255)
  password_hash  varchar(255)
  country_code   varchar(10)  // e.g., '1', '91', '44'
  contact_number varchar(20)  // e.g., '7012345678'
  user_type      varchar(20)  [not null] // 'CUSTOMER', 'VENDOR', 'EMPLOYEE', 'SUPER_ADMIN'
  user_status    varchar(20)  [not null] // 'ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED'

  google_id          varchar(255)
  google_verified    boolean [default: false]
  email_verified     boolean [default: false]
  phone_verified     boolean [default: false]
  created_at     timestamp [default: `now()`]
  updated_at     timestamp [default: `now()`]

  Indexes {
    (email, user_type) [unique]
    (country_code, contact_number, user_type) [unique]
    (google_id, user_type) [unique]
  }
}
-- OK
Table user_locations {
  user_location_id  uuid [pk, default: `uuid_generate_v4()`]
  user_id           uuid [ref: > users.user_id]

  location_name     varchar(50)
  address           varchar(100)
  district          varchar(100)
  city              varchar(100)
  country           varchar(100)
  latitude          float
  longitude         float
  geohash           varchar(10)

  default_location  boolean [default: false]

  created_at     timestamp [default: `now()`]
  updated_at     timestamp [default: `now()`]
}
-- OK
Table user_details {
  user_id           uuid [pk, ref: > users.user_id, unique] // 1:1 link with user
  first_name        varchar(50)
  middle_name       varchar(50)
  last_name         varchar(50)
  nickname          varchar(100)
  gender            enum('MALE', 'FEMALE', 'OTHER')
  birth_date        date
  profile_image     varchar(255)

  onesignal_id      varchar(255)

  timezone          varchar(50) // e.g., 'America/New_York' from the IANA timezone database
  referral_code     varchar(50) [unique]  // Unique referral code per user

  notification_enabled  boolean [default: false]
  is_registered     boolean // to check if the user is created or not (if salon create a new customer its false)

  created_at     timestamp [default: `now()`]
  updated_at     timestamp [default: `now()`]
}
-- Ok
Table tokens {
  token_id     uuid [pk, default: `uuid_generate_v4()`]
  user_id      uuid [ref: > users.user_id]
  token        varchar(512) [not null]

  created_at   timestamp [default: `now()`]
  expires_at   timestamp
  revoked      boolean [default: false]
}
-- Ok
Table token_details {
  token_id     uuid [pk, ref: > tokens.token_id]

  device_info    varchar(255) // e.g., 'iPhone 12, iOS 16' or 'Chrome 116 on Windows 10'
  device_type    varchar(255) // MOBILE / WEB / TABLET / OTHER
  device_os      varchar(255) // e.g., iOS 16, Android 13, Windows 11
  browser_name   varchar(100) // e.g., Chrome, Safari, Firefox
  browser_version varchar(50) // e.g., 116.0.5845.111
  is_mobile      boolean      // true/false, helps distinguish phone vs tablet vs desktop

  timezone     varchar(50)  // e.g., 'America/New_York'

  created_at     timestamp [default: `now()`]
}

Table referrals {
  referral_id uuid [pk, default: `uuid_generate_v4()`]

  referred_user_id uuid [ref: > users.user_id]  // The user who signed up using a referral
  referrer_user_id uuid [ref: > users.user_id]  // The user who referred them

  created_at timestamp [default: `now()`]
}

Table rewards {
  reward_id   uuid [pk, default: `uuid_generate_v4()`]

  user_id     uuid [ref: > users.user_id]
  discount_code   varchar(20) [unique]

  redeemed    boolean [default: false]
  expires_at   timestamp

  created_at   timestamp [default: `now()`]
  updated_at   timestamp [default: `now()`]
}


Table customers {
  id             uuid [pk, default: `uuid_generate_v4()`]
  user_id        uuid [ref: > users.user_id, unique] // 1:1 link with user
  created_at     timestamp [default: `now()`]
  updated_at     timestamp [default: `now()`]
}

Table vendors {
  vendor_id         uuid [pk, default: `uuid_generate_v4()`]

  vendor_status     varchar(20)  [not null] // 'ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED'
  parent_vendor_id  uuid [ref: > vendors.vendor_id] // 1 : M link for franchise
  is_franchisor     boolean [default: false]

  vendor_verified   boolean [default: false]
  registration_complete boolean [default: false]

  created_at     timestamp [default: `now()`]
  updated_at     timestamp [default: `now()`]
}

Table branches {
  vendor_id        uuid [ref: > vendors.vendor_id]
  branch_id        uuid [pk, default: `uuid_generate_v4()`]

  name             varchar(100) [not null]
  email            varchar(100)
  country_code     varchar(10)  // e.g., '+1', '+91', '+44'
  contact_number   varchar(100)
  franchise_name   varchar(255)
  gender           enum

  is_default       boolean [default: false]

  created_at     timestamp [default: `now()`]
  updated_at     timestamp [default: `now()`]
}

Table branch_configs {
  branch_config_id        uuid [pk, default: `uuid_generate_v4()`]
  branch_id               uuid [ref: > branches.branch_id, unique] // 1 : 1 relationship

  cancel_before_minutes   int // This controls how far in advance a customer is allowed to cancel their appointment — e.g., if set to 1440 minutes, they can cancel up to 24 hours before the appointment time, but not after.
  booking_limit_days      int // So, if a salon doesn’t override it, customers can book appointments up to 30 days ahead.
  allow_at_venue_payment  boolean
  allow_online_payment    boolean
  is_premium              boolean
  staff_size              varchar(40)
  visit_type              varchar(50) // 'ON_PREMISES', 'HOME_VISIT', 'BOTH'
  timezone                varchar(50) // e.g., 'America/New_York' from the IANA timezone database
  slot_times              int [default: 15]

  created_at     timestamp [default: `now()`]
  updated_at     timestamp [default: `now()`]
}

Table branch_locations {
  branch_location_id      uuid [pk, default: `uuid_generate_v4()`]
  branch_id               uuid [ref: > branches.branch_id, unique]  // 1 : 1 relationship
  address                 varchar(100)
  apartment               varchar(100)
  district                varchar(100)
  city                    varchar(100)
  region                  varchar(100)
  postal_code             varchar(50)
  directions              varchar(250)
  country                 varchar(100)

  latitude         float
  longitude        float
  geohash          varchar(10)

  created_at     timestamp [default: `now()`]
  updated_at     timestamp [default: `now()`]
}

Table branch_hours {
  branch_hour_id   uuid [pk, default: `uuid_generate_v4()`]
  branch_id        uuid [ref: > branches.branch_id, unique] // 1 : 1 relationship
  day_of_week      tinyint
  open_time        time
  close_time       time
  is_closed        boolean [default: true]

  created_at     timestamp [default: `now()`]
  updated_at     timestamp [default: `now()`]
}

Table business_categories {
  id            uuid [pk, default: `uuid_generate_v4()`]
  name          varchar(100) // e.g., "Hair & Styling"
  franchise_id     uuid [ref: > vendors.vendor_id, unique] // 1 : 1 relationship
  created_at     timestamp [default: `now()`]
  updated_at     timestamp [default: `now()`]
}

Table business_subcategories {
  id                     uuid [pk, default: `uuid_generate_v4()`]
  business_category_id   uuid [ref: > business_categories.id]
  name                   varchar
  created_at             timestamp [default: `now()`]
  updated_at             timestamp [default: `now()`]
}

Table branch_categories {
  id            uuid [pk, default: `uuid_generate_v4()`]
  branch_id     uuid [ref: > branches.branch_id]
  category_id   uuid [ref: > business_categories.id]

  created_at    timestamp [default: `now()`]
  updated_at    timestamp [default: `now()`]
}

Table employees {
  id                  uuid [pk, default: `uuid_generate_v4()`]
  user_id             uuid [ref: > users.user_id, unique] // 1:1 link with user
  vendor_id           uuid [ref: > vendors.vendor_id]
  branch_id           uuid [ref: > branches.branch_id]
  employee_id         uuid [pk, default: `uuid_generate_v4()`]
  bio                 varchar(255)
  is_removed               boolean [default: false]
  offersHomeService        boolean [default: false]
  allowProfileSharing      boolean [default: false]
  allowSocialMediaLinking  boolean [default: false]

  created_at     timestamp [default: `now()`]
  updated_at     timestamp [default: `now()`]
}

Table roles {
  role_id     uuid [pk, default: `uuid_generate_v4()`]
  name        varchar(50) // 'OWNER', 'REGIONAL_MANAGER', 'BRANCH_MANAGER', 'HAIR_STYLIST'
  description varchar(100)
}

Table employee_roles {
  employee_id    uuid [ref: > employees.employee_id]
  id             uuid [pk, default: `uuid_generate_v4()`]
  role_id        uuid [ref: > roles.role_id]

  scope_type varchar(20) // 'VENDOR', 'BRANCH'
  scope_id   uuid         // refers to either vendor_id or branch_id

  created_at timestamp [default: `now()`]
}

Table employee_social_media {
  social_media_id     uuid [pk, default: `uuid_generate_v4()`]
  employee_id         uuid [ref: > employees.employee_id, unique]
  social_media_platform     varchar(50)
  social_media_profile_link varchar(255)

  created_at     timestamp [default: `now()`]
  updated_at     timestamp [default: `now()`]
}
-- Ok
Table user_otps {
  id           uuid [pk, default: `uuid_generate_v4()`]
  user_id      uuid [ref: > users.user_id]

  otp_code     varchar(10)  // numeric or alphanumeric OTP
  purpose      varchar(50)  // e.g., 'phone_verification', 'password_reset'
  expires_at   timestamp    // when OTP expires
  verified     boolean [default: false]
  attempts     int [default: 0]
  channel      varchar(20)     // e.g., 'sms', 'email'
  used_at      timestamp

  created_at     timestamp [default: `now()`]
  updated_at     timestamp [default: `now()`]
}

Table master_branch_services {
  id           uuid [pk, default: `uuid_generate_v4()`]
  vendor_id    uuid [ref: > vendors.vendor_id]
  category_id   uuid [ref: > business_subcategories.id]
  name         varchar
  description  varchar
}

Table master_branch_service_variants {
  id           uuid [pk, default: `uuid_generate_v4()`]
  master_branch_service_id    uuid [ref: > master_branch_services.id]

  name       varchar
  description text
  duration    int
  price       decimal
  price_type  enum
}

Table branch_services {
  id           uuid [pk, default: `uuid_generate_v4()`]
  branch_id    uuid [ref: > branches.branch_id]
  name         varchar(255)
  description  Text
  gender       enum
  category_id  uuid [ref: > business_subcategories.id]
  inherited_from   uuid [ref: > master_branch_services.id]

  created_at     timestamp [default: `now()`]
  updated_at     timestamp [default: `now()`]
}

Table branch_service_variants {
  id   uuid [pk, default: `uuid_generate_v4()`]
  branch_service_id     uuid [ref: > branch_services.id]

  name       varchar
  description text
  duration    int
  price       decimal
  price_type  enum
}

Table branch_service_employee_overrides {
  id   uuid [pk, default: `uuid_generate_v4()`]
  service_variant_id    uuid [ref: > branch_service_variants.id]
  employee_id   uuid [ref: > employees.id]

  duration    int
  price       decimal
  price_type  enum
}

Table branch_service_time_segments {
  id   uuid [pk, default: `uuid_generate_v4()`]
  service_variant_id    uuid [ref: > branch_service_variants.id]
  duration_type     enum
  is_main_time      boolean
  duration_in_seconds   int
}

// ------------------- Appointments
Table appointments {
  appointment_id uuid [pk, default: `uuid_generate_v4()`]
  customer_id uuid [ref: > customers.id, not null]
  branch_id uuid [ref: > branches.branch_id, not null]
  start_time timestamp [not null]
  end_time timestamp [not null]
  status varchar(20) [not null] // 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELED', 'NO_SHOW'
  total_price decimal [not null]
  payment_status varchar(20) [not null] // 'PENDING', 'PAID', 'FAILED'
  payment_method enum
  notes text
  cancellation_reason varchar(255)
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table appointment_services {
  id uuid [pk, default: `uuid_generate_v4()`]
  appointment_id uuid [ref: > appointments.appointment_id]
  service_variant_id uuid [ref: > branch_service_variants.id]
  employee_id uuid [ref: > employees.id]
  price decimal
  price_type  enum
  duration_in_minutes int
  created_at timestamp [default: `now()`]
}

Table appointment_service_time_segments {
  id   uuid [pk, default: `uuid_generate_v4()`]
  appointment_service_id    uuid [ref: > appointment_services.id]
  duration_type     enum
  is_main_time      boolean
  duration_in_seconds   int
}

Table appointment_notifications {
  notification_id uuid [pk, default: `uuid_generate_v4()`]
  appointment_id uuid [ref: > appointments.appointment_id, not null]
  user_id uuid [ref: > users.user_id, not null] // Recipient (customer or employee)
  user_type enum // CUSTOMER or EMPLOYEE
  notification_type varchar(50) [not null] // 'REMINDER', 'CANCELLATION', 'CONFIRMATION'
  channel varchar(20) [not null] // 'SMS', 'EMAIL', 'PUSH'
  sent_at timestamp
  status varchar(20) [not null] // 'PENDING', 'SENT', 'FAILED'
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

// Payment Details

Table invoice_items {
  id   uuid [pk, default: `uuid_generate_v4()`]
  invoice_id        uuid [ref: > invoices.id, not null]
  payable_id            uuid [ref: > appointments.appointment_id, not null] // ID of the item being paid for (e.g., appointment_id, product_sale_id)
  payable_type          varchar(50) [not null] // e.g., 'APPOINTMENT', 'PRODUCT_SALE', 'PACKAGE', 'CLASS'
}

Table invoices {
  id   uuid [pk, default: `uuid_generate_v4()`]
  vendor_id             uuid [ref: > vendors.vendor_id, not null]
  branch_id             uuid [ref: > branches.branch_id, not null]
  customer_id           uuid [ref: > customers.id, not null]

  subtotal              decimal [not null, default: 0] // Price before discounts and taxes
  total_discount_amount decimal [not null, default: 0] // Total amount from applied discounts
  total_tax_amount      decimal [not null, default: 0] // Total amount from applied taxes
  total_amount          decimal [not null] // The final amount due (subtotal - discount + tax)

  amount_paid           decimal [not null, default: 0]
  outstanding_amount    decimal [not null] // The remaining balance

  status                varchar(20) [not null, default: 'PENDING'] // 'PENDING', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'VOID'
  notes                 text

  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table payments {
  payment_id                 uuid [pk, default: `uuid_generate_v4()`]
  invoice_id             uuid [ref: > invoices.id, not null]
  processed_by_employee_id   uuid [ref: > employees.id] // Employee who processed the payment (especially for cash)

  amount                     decimal [not null]
  payment_method             varchar(50) [not null] // 'CASH', 'RAZORPAY', 'CARD_TERMINAL', 'BANK_TRANSFER'
  payment_status             varchar(20) [not null] // 'SUCCESS', 'PENDING', 'FAILED'

  payment_date               timestamp [not null, default: `now()`]

  created_at                 timestamp [default: `now()`]
}

Table payment_gateway_details {
  payment_id                  uuid [pk, ref: > payments.payment_id] // 1:1 with payments
  gateway_name                varchar(50) [not null, default: 'RAZORPAY'] // e.g., 'RAZORPAY', 'STRIPE'
  gateway_order_id            varchar(255) // Razorpay's order_id
  gateway_payment_id          varchar(255) // Razorpay's payment_id
  gateway_signature           varchar(255) // For webhook verification
  metadata                    jsonb // To store the full response from the gateway
}

Table invoice_discounts {
  id              uuid [pk, default: `uuid_generate_v4()`]
  invoice_id  uuid [ref: > invoices.id, not null]
  reward_id       uuid [ref: > rewards.reward_id, not null] // From your existing rewards table
  discount_code   varchar(50) [not null] // Denormalized for easy lookup
  discount_amount decimal [not null] // The value deducted
}

Table payment_refunds {
  id              uuid [pk, default: `uuid_generate_v4()`]
  payment  uuid [ref: > payments.payment_id, not null]
  amount                     decimal [not null]
  refund_method    enum  // 'CASH', 'WALLET', 'RAZORPAY'
  refund_status    enum  // 'INITATED', "PROCESSING", "REFUNDED", "FAILED", "CANCELLED"
  refund_date   timestamp [default: `now()`]
}

Table payment_refund_gateway_details {
  refund_id                  uuid [pk, ref: > payment_refunds.id] // 1:1 with payments
  gateway_name                varchar(50) [not null, default: 'RAZORPAY'] // e.g., 'RAZORPAY', 'STRIPE'
  gateway_refund_id            varchar(255) // Razorpay's refund_id
  gateway_signature           varchar(255) // For webhook verification
  metadata                    jsonb // To store the full response from the gateway
}

//  Taxes

Table taxes {
  tax_id          uuid [pk, default: `uuid_generate_v4()`]
  country_code    varchar(10) [not null] // e.g., 'IN', 'LK'
  name            varchar(100) [not null] // e.g., 'GST', 'VAT'
  rate_percentage decimal(5, 2) [not null] // e.g., 18.00 for 18%
  description     text
  is_active       boolean [default: true]

  Indexes {
    (country_code, name) [unique]
  }
}

Table invoice_tax_breakdown {
  id              uuid [pk, default: `uuid_generate_v4()`]
  invoice_id  uuid [ref: > invoices.id, not null]
  tax_id          uuid [ref: > taxes.tax_id, not null]
  applied_rate    decimal(5, 2) [not null] // The rate at the time of transaction
  tax_amount      decimal [not null] // The calculated tax amount
}



// Support for scheduling tables
Table resource_blocked_times {
  id uuid [pk, default: `uuid_generate_v4()`]
  resource_id uuid [ref: > employees.employee_id, ref: > branches.branch_id,not null] // Can be employee_id or branch_id
  resource_type varchar(20) [not null] // 'EMPLOYEE', 'BRANCH'
  start_time timestamp [not null]
  end_time timestamp [not null]
  reason varchar(255)
  created_at timestamp [default: `now()`]
}

Table employee_hours {
  id uuid [pk, default: `uuid_generate_v4()`]
  employee_id uuid [ref: > employees.id]
  day_of_week tinyint
  start_time time
  end_time time
  is_working_day boolean [default: `true`]
  created_at timestamp [default: `now()`]
}

```
