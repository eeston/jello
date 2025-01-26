import { z } from "zod";

export const LoginSchema = z.object({
  password: z.string().trim().min(1).optional(), // TODO: handle demo server
  username: z.string().trim().min(1),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;
