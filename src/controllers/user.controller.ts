import { Request, Response } from "express";
import * as userCommand from "../commands/user.command";
import { hashPassword, comparePassword } from "../utils/crypto.util";
import { generateToken } from "../utils/auth.util";
import { ApiResponse } from "../interfaces/response.interface";
import { UserResponse } from "../models/user.model";

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, name } = req.body;

  // Check if user already exists
  const existingUser = await userCommand.findUserByEmail(email);
  if (existingUser) {
    res.status(409).json({
      success: false,
      message: "User already exists",
    });
    return;
  }

  // Hash password before saving
  const hashedPassword = await hashPassword(password);

  // Create user
  const newUser = await userCommand.createUser({
    email,
    password: hashedPassword,
    name,
  });

  // Remove the password from the response
  const { password: _, ...userWithoutPassword } = newUser;

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: userWithoutPassword,
  } as ApiResponse<UserResponse>);
};

/**
 * Login a user and return a JWT token
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  // Find user
  const user = await userCommand.findUserByEmail(email);
  if (!user) {
    res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
    return;
  }

  // Verify password
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
    return;
  }

  // Generate JWT token
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: "USER", // Modify or fetch from DB as needed
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: { token },
  } as ApiResponse<{ token: string }>);
};

/**
 * Get all users (Protected route example)
 */
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  const users = await userCommand.getAllUsers();

  res.status(200).json({
    success: true,
    data: users,
  } as ApiResponse<UserResponse[]>);
};
