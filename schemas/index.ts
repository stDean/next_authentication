import { UserRole } from "@prisma/client";
import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "email is required.",
  }),
  password: z.string().min(1, {
    message: "password is required.",
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "email is required.",
  }),
  password: z.string().min(6, {
    message: "password must be at least 6 characters long.",
  }),
  name: z.string().min(1, {
    message: "name is required.",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "email is required.",
  }),
});

export const ResetPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "password must be at least 6 characters long.",
  }),
});

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    email: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.USER, UserRole.ADMIN]),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    data => {
      if (data.password && !data.newPassword) {
        return false;
      }

      if (!data.password && data.newPassword) {
        return false;
      }

      return true;
    },
    { message: "New password is required.", path: ["newPassword"] }
  );
