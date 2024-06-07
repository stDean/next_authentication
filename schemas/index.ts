import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "email is required.",
  }),
  password: z.string().min(1, {
    message: "password is required.",
  }),
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
