import { Request } from "express";

// Extend the Express Request to include a user object properly
export interface AuthUser {
  id?: number;
  email?: string;
  role?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}
