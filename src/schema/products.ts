import { string, z } from "zod";

export const ProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().min(0),
  tags: z.string().array(),
});
