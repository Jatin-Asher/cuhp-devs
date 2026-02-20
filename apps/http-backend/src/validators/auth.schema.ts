import { z } from "zod";

export const signupSchema = z.object({
    fullName: z.string()
    .min(3, "Full name must be atleast 3 characters")
    .max(50, "Full name is too long")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),

    email: z.string()
    .email("Invalid email address"),

    studentId: z.string()
    .min(11, "Student ID must be at least 11 characters")
    .optional(),

    password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .max(50, "Password is too long"),
});