import crypto from 'crypto';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/time.js';
import { Session } from '../models/session.js';

export const createSession = async (userId) => {
  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  return Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
};

export const setSessionCookies = (res, session) => {
  const opts = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
  };

  res.cookie('accessToken', session.accessToken, {
    ...opts,
    maxAge: FIFTEEN_MINUTES,
  });

  res.cookie('refreshToken', session.refreshToken, {
    ...opts,
    maxAge: ONE_DAY,
  });

  res.cookie('sessionId', session._id, {
    ...opts,
    maxAge: ONE_DAY,
  });
};
