import type { EnumTypes } from '@/database/enums';

export interface JwtTokenPayload {
  id: number;
  iat?: number;
  exp?: number;
}

export interface JwtAccessTokenPayload extends JwtTokenPayload {
  userType: EnumTypes.UserType;
  userStatus: EnumTypes.UserStatus;
}

export interface JwtRefreshTokenPayload extends JwtTokenPayload {
  sid: string; // session id
  rid: string; // refresh token id
  rot: number; // refresh token rotation count
}

const units = [
  'Years',
  'Year',
  'Yrs',
  'Yr',
  'Y',
  'Weeks',
  'Week',
  'W',
  'Days',
  'Day',
  'D',
  'Hours',
  'Hour',
  'Hrs',
  'Hr',
  'H',
  'Minutes',
  'Minute',
  'Mins',
  'Min',
  'M',
  'Seconds',
  'Second',
  'Secs',
  'Sec',
  's',
  'Milliseconds',
  'Millisecond',
  'Msecs',
  'Msec',
  'Ms',
] as const;

type Unit = (typeof units)[number];
type UnitAnyCase = Unit | Uppercase<Unit> | Lowercase<Unit>;

export type JwtTokenExpiry =
  | `${number}` // e.g. "60"
  | `${number}${UnitAnyCase}` // e.g. "60s", "5Hrs", "10DAYS"
  | `${number} ${UnitAnyCase}`; // e.g. "60 s", "5 Hrs", "10 DAYS"

// regex to cover:
//   "60"
//   "60s", "5Hrs", "10DAYS"
//   "60 s", "5 Hrs", "10 DAYS"
export const jwtExpiryRegex = new RegExp(
  `^\\d+(?:\\.?\\d+)?(?:\\s?(?:${units.join('|')}|${units
    .map((u) => u.toLowerCase())
    .join('|')}|${units.map((u) => u.toUpperCase()).join('|')}))?$`,
);

export interface RefreshTokenRedisRecord {
  sessionId: string;
  refreshTokenId: string;
  userId: number;
  revoked: boolean;
  expiresAt: number;
}
