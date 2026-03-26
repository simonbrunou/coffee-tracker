import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const coffeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  roaster: z.string().optional(),
  origin: z.string().optional(),
  variety: z.string().optional(),
  brewMethod: z.string().optional(),
  grindSize: z.string().optional(),
  waterTemp: z.number().int().optional(),
  doseGrams: z.number().positive().optional(),
  yieldMl: z.number().positive().optional(),
  brewTimeSeconds: z.number().int().positive().optional(),
  rating: z.number().int().min(0).max(5).optional(),
  aroma: z.number().int().min(0).max(5).optional(),
  acidity: z.number().int().min(0).max(5).optional(),
  body: z.number().int().min(0).max(5).optional(),
  sweetness: z.number().int().min(0).max(5).optional(),
  bitterness: z.number().int().min(0).max(5).optional(),
  flavorNotes: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CoffeeInput = z.infer<typeof coffeeSchema>;
