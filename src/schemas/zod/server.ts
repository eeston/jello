import { z } from "zod";

export const ServerSchema = z.object({
  url: z.string().trim().url(),
});

export type ServerSchemaType = z.infer<typeof ServerSchema>;
