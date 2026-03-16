import {createHmac, timingSafeEqual} from 'node:crypto';

const TOKEN_VERSION = 'v1';
const DEFAULT_EXPIRES_MINUTES = 30;

interface ResetPasswordTokenPayload {
  uid: string;
  email: string;
  exp: number;
  v: string;
}

interface CreateKeyParams {
  userId: string;
  email: string;
  expiresInMinutes?: number;
}

function getSecret() {
  const secret = process.env.RESET_PASSWORD_TOKEN_SECRET;

  if (!secret) {
    throw new Error('Missing RESET_PASSWORD_TOKEN_SECRET');
  }

  return secret;
}

function base64UrlEncode(value: string) {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function signPayload(encodedPayload: string) {
  return createHmac('sha256', getSecret())
    .update(encodedPayload)
    .digest('base64url');
}

export function createResetPasswordKey({
  userId,
  email,
  expiresInMinutes = DEFAULT_EXPIRES_MINUTES,
}: CreateKeyParams) {
  const payload: ResetPasswordTokenPayload = {
    uid: userId,
    email,
    exp: Date.now() + expiresInMinutes * 60 * 1000,
    v: TOKEN_VERSION,
  };

  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = signPayload(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function verifyResetPasswordKey(
  key: string,
): ResetPasswordTokenPayload | null {
  const [encodedPayload, providedSignature] = key.split('.');

  if (!encodedPayload || !providedSignature) {
    return null;
  }

  const expectedSignature = signPayload(encodedPayload);
  const providedBuffer = Buffer.from(providedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (providedBuffer.length !== expectedBuffer.length) {
    return null;
  }

  if (!timingSafeEqual(providedBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      base64UrlDecode(encodedPayload),
    ) as ResetPasswordTokenPayload;

    if (
      payload.v !== TOKEN_VERSION ||
      typeof payload.uid !== 'string' ||
      typeof payload.email !== 'string' ||
      typeof payload.exp !== 'number'
    ) {
      return null;
    }

    if (payload.exp < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
