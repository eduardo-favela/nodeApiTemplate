import { User as PrismaUser, Prisma } from "@prisma/client";

/**
 * Since we are using Prisma, the database schema is actually defined in `prisma/schema.prisma`.
 * Prisma automatically generates TypeScript interfaces for all our database tables
 * (like `User`, `Post`, etc.), which we can re-export or extend here.
 */

// Export the default generated database type
export type User = PrismaUser;

// Example of a custom Data Transfer Object (DTO) for creating a User,
// derived from Prisma's generated types but without the ID/dates
export type UserCreateInput = Prisma.UserCreateInput;

// Example of an object definition that strips the password for safe API responses
export type UserResponse = Omit<User, "password">;
