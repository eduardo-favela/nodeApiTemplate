import prisma from "../config/db";
import { Prisma, User } from "@prisma/client";

/**
 * Creates a new user in the database.
 * @param data { email, password, name }
 * @returns The created user record
 */
export const createUser = async (
  data: Prisma.UserCreateInput,
): Promise<User> => {
  return prisma.user.create({
    data: {
      email: data.email,
      password: data.password,
      name: data.name,
    },
  });
};

/**
 * Finds a user by their email address.
 * @param email
 * @returns The user record or null if not found
 */
export const findUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { email },
  });
};

/**
 * Retrieves all users from the database.
 * @returns List of users
 */
export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });
};
