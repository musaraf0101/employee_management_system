import { z } from "zod";

export const addUserSchema = z.object({
  name: z.string().min(1, "name must be an at least 1 charactors"),
  email: z.string().email("email is required"),
  password: z.string().min(8, "password must be an at least 8 charactors"),
  role: z.enum(["admin", "employee"], {
    message: "Role must be either admin or employee",
  }),
  position: z.string().optional(),
});
export const updateUserSchema = z.object({
  name: z.string().min(1, "name must be an at least 1 charactors").optional(),
  email: z.string().email("email is required").optional(),
  password: z
    .string()
    .min(8, "password must be an at least 8 charactors")
    .optional(),
  role: z.enum(["admin", "employee"]).optional(),
  position: z.string().optional(),
});
