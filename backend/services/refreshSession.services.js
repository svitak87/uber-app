import crypto from "crypto";
import { refreshSessionModel } from "../models/refreshSession.model.js";

const REFRESH_TOKEN_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000;

export const hashRefreshToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const storeRefreshSession = async ({ user, jti, familyId, tokenHash, expiresAt }) => {
  await refreshSessionModel.create({
    userId: user._id,
    tokenHash,
    jti,
    familyId,
    expiresAt,
  });
};

export const createRefreshSession = async ({ user }) => {
  const familyId = crypto.randomUUID();
  const jti = crypto.randomUUID();
  const refreshToken = user.refreshToken({ jti, familyId });
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS);

  await storeRefreshSession({
    user,
    jti,
    familyId,
    tokenHash: hashRefreshToken(refreshToken),
    expiresAt,
  });

  return refreshToken;
};

export const rotateRefreshSession = async ({ user, session, familyId }) => {
  const jti = crypto.randomUUID();
  const refreshToken = user.refreshToken({ jti, familyId });
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS);

  const revoked = await refreshSessionModel.findOneAndUpdate(
    { _id: session._id, revokedAt: null },
    { revokedAt: new Date(), replacedBy: jti },
    { new: true }
  );

  if (!revoked) {
    return null;
  }

  await storeRefreshSession({
    user,
    jti,
    familyId,
    tokenHash: hashRefreshToken(refreshToken),
    expiresAt,
  });

  return refreshToken;
};

export const revokeRefreshSession = async ({ jti }) => {
  await refreshSessionModel.updateOne({ jti }, { revokedAt: new Date() });
};

export const revokeRefreshFamily = async ({ familyId }) => {
  await refreshSessionModel.updateMany(
    { familyId, revokedAt: null },
    { revokedAt: new Date() }
  );
};

export const refreshSessionServices = {
  hashRefreshToken,
  createRefreshSession,
  rotateRefreshSession,
  revokeRefreshSession,
  revokeRefreshFamily,
};