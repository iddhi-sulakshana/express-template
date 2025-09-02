import { ENV } from 'core';
import { TokensRedis } from 'database/redis/tokens.redis';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import type {
  JwtAccessTokenPayload,
  JwtRefreshTokenPayload,
  JwtTokenPayload,
  RefreshTokenRedisRecord,
} from 'types/jwt.types';

export function generateLoginTokens(payload: JwtAccessTokenPayload) {
  const accessToken = generateAccessToken({
    id: payload.id,
    userType: payload.userType,
    userStatus: payload.userStatus,
  });
  // Generate a new session id
  const sessionId = nanoid();
  const refreshTokenId = nanoid();

  const refreshToken = generateRefreshToken({
    id: payload.id,
    sid: sessionId,
    rid: refreshTokenId,
    rot: 0,
  });

  // Get the expiresAt time from the refresh token
  const expiresAt = getRefreshTokenExpiresAt(refreshToken);
  // Store the refresh token in the redis server for tracking the user sessions
  const record: RefreshTokenRedisRecord = {
    sessionId,
    refreshTokenId,
    userId: payload.id,
    revoked: false,
    expiresAt,
  };
  TokensRedis.setRefreshToken(record);
  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string): JwtAccessTokenPayload {
  return jwt.verify(token, ENV.JWT_SECRET) as JwtAccessTokenPayload;
}

export async function verifyRefreshToken(token: string): Promise<JwtRefreshTokenPayload | null> {
  try {
    const payload = jwt.verify(token, ENV.JWT_REFRESH_SECRET) as JwtRefreshTokenPayload;
    // Check with the redis server if the refresh token is valid
    const record = await TokensRedis.getRefreshToken(payload.sid);

    if (!record) return null;
    if (record.revoked) return null;

    // Check if the token has expired by comparing with current time
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp! < currentTime) return null;

    return payload;
  } catch {
    return null;
  }
}

export async function generateRefreshTokens(
  refresghTokenPayload: JwtRefreshTokenPayload,
  accessTokenPayload: JwtAccessTokenPayload,
) {
  const accessToken = generateAccessToken(accessTokenPayload);

  const newRefreshTokenPayload = {
    ...refresghTokenPayload,
    rid: nanoid(),
    rot: refresghTokenPayload.rot + 1,
  };

  const refreshToken = generateRefreshToken(newRefreshTokenPayload);
  // Store the refresh token in the redis server for tracking the user sessions
  const record: RefreshTokenRedisRecord = {
    sessionId: refresghTokenPayload.sid,
    refreshTokenId: newRefreshTokenPayload.rid,
    userId: accessTokenPayload.id,
    revoked: false,
    expiresAt: getRefreshTokenExpiresAt(refreshToken),
  };
  await TokensRedis.setRefreshToken(record);
  return { accessToken, refreshToken };
}

function generateAccessToken(payload: JwtAccessTokenPayload) {
  const accessToken = jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: ENV.JWT_EXPIRES_IN });
  return accessToken;
}

function generateRefreshToken(payload: JwtRefreshTokenPayload) {
  if (payload.exp) {
    return jwt.sign(payload, ENV.JWT_REFRESH_SECRET);
  }
  return jwt.sign(payload, ENV.JWT_REFRESH_SECRET, { expiresIn: ENV.JWT_REFRESH_EXPIRES_IN });
}

// Get the seconds to decoded.exp from current time
function getRefreshTokenExpiresAt(token: string) {
  const decoded = jwt.decode(token) as JwtTokenPayload;
  if (!decoded || !decoded.exp) return 1000;

  const expiresAt = decoded.exp;
  const currentTime = Date.now() / 1000;
  const secondsToExpire = expiresAt - currentTime;

  return Math.ceil(secondsToExpire);
}
