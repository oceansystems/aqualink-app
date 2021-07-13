import { Request } from 'express';
import admin from 'firebase-admin';

const extractAuthHeaderAsBearerToken = (
  req: Request,
): string | null | undefined => {
  const authHeader = req.headers.authorization;
  const match = authHeader && authHeader.match(/bearer (.*)/i);
  return match && match[1];
};

export const extractAndVerifyToken = async (
  req: Request,
): Promise<admin.auth.DecodedIdToken | undefined> => {
  const token = extractAuthHeaderAsBearerToken(req);
  if (!token) {
    return undefined;
  }
  try {
    const firebaseUser = await admin.auth().verifyIdToken(token, true);
    return firebaseUser;
  } catch (err) {
    return undefined;
  }
};
