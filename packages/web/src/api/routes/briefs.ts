import { z } from "zod";
import { base } from "../__core/app";
import { db } from "../database";
import * as schema from "../database/schema";

const briefInput = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  company: z.string().max(160).optional(),
  sector: z.enum(["real-estate", "resorts", "golf"]),
  squareFeet: z.number().int().min(500).max(200_000),
  features: z.array(z.string().max(60)).max(12),
  estimate: z.number().int().min(0),
  notes: z.string().max(4000).optional(),
});

export const briefs = {
  create: base.input(briefInput).handler(async ({ input }) => {
    const [row] = await db
      .insert(schema.briefs)
      .values({
        name: input.name,
        email: input.email,
        company: input.company ?? null,
        sector: input.sector,
        squareFeet: input.squareFeet,
        features: input.features.join(", "),
        estimate: input.estimate,
        notes: input.notes ?? null,
      })
      .returning();

    return { id: row?.id ?? 0, received: true };
  }),
};
