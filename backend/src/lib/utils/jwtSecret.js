const FALLBACK_DEV_JWT_SECRET = "chatalaxy-dev-jwt-secret";

export const getJwtSecret = () => {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET is required in production.");
  }

  return FALLBACK_DEV_JWT_SECRET;
};
