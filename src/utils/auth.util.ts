import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_please_change";
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1h";
const MASTER_API_TOKEN = process.env.MASTER_API_TOKEN;

/**
 * Generates a JWT token for a user session
 * @param payload Data to encode in the token
 * @returns JWT Token
 */
export const generateToken = (payload: object | string | Buffer): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION as any });
};

/**
 * Verifies a JWT token
 * @param token
 * @returns Decoded token payload if valid, null otherwise
 */
export const verifyToken = (token: string): any | null => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Checks if a provided token matches the master API token
 * @param token
 * @returns boolean
 */
export const verifyMasterToken = (token: string): boolean => {
  if (!MASTER_API_TOKEN) {
    console.warn(
      "⚠️ MASTER_API_TOKEN is not defined in the environment variables!",
    );
    return false;
  }
  return token === MASTER_API_TOKEN;
};
