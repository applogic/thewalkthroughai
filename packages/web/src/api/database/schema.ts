import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Inbound project briefs from the contact form.
 */
export const briefs = sqliteTable("briefs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  sector: text("sector").notNull(),
  squareFeet: integer("square_feet").notNull(),
  features: text("features").notNull(),
  estimate: integer("estimate").notNull(),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type Brief = typeof briefs.$inferSelect;
