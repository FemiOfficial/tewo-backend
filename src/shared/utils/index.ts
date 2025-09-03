import { createHmac } from 'crypto';

export const createHmacForString = (data: string, secret?: string) => {
  if (!secret) {
    secret = process.env.INTERNAL_SECRET!;
  }

  return createHmac('sha256', secret).update(data).digest('hex');
};

export const generateRandomDigits = (length: number) => {
  return Math.floor(
    10 ** (length - 1) + Math.random() * 9 * 10 ** (length - 1),
  );
};
