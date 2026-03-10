import { Request, Response, NextFunction } from "express";
import { verifyToken, verifyMasterToken } from "../utils/auth.util";

import { AuthUser } from "../interfaces/request.interface";

// Extend the Express Request interface to include our custom user property
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

/**
 * Middleware that protects routes requiring authentication.
 * It favors the 'Bearer' token. It also supports checking against a Master Token
 * if explicitly enabled.
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access Denied: Missing or malformed authentication token",
    });
  }

  const token = authHeader.split(" ")[1];

  // First, check if the token matches the MASTER_API_TOKEN
  if (token && verifyMasterToken(token)) {
    req.user = { role: "MASTER_API" }; // Provide context that a machine/master auth was successful
    return next();
  }

  // Otherwise, verify it as a standard JWT user session
  if (!token) {
    return res.status(401).json({ success: false, message: "No token" });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: "Access Denied: Invalid or expired token",
    });
  }

  // Bind the decoded user payload to the request for subsequent handlers
  req.user = decoded;
  next();
};

export default authenticate;
