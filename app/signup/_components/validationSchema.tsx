// @ts-nocheck
import { z } from "zod";

const passwordSchema = z
  .object({
    password1: z.string().min(8, "Password should be at least 8 characters"),
    password2: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.password1 === data.password2, {
    message: "Passwords must match",
    path: ["password2"],
  });

const validationSchema = z.object({
  name: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email format"),
  company_name: z.string(),
  mob_no: z
    .string()
    .regex(/^\d{10}$/, "Contact number should be 10 digits")
    .min(1, "Contact number is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  role: z.string().min(1, "Role is required"),
  company_desc: z.string().optional(),
  ...passwordSchema.shape, // Combine schemas by spreading the shape
});

export default validationSchema;
