import { pgTable, varchar, integer } from "drizzle-orm/pg-core";

export const revenue = pgTable("revenue", {
    month: varchar("month", { length: 4 }).unique().notNull(),
    revenue: integer("revenue").notNull(),
});

export type Revenue = typeof revenue.$inferSelect;
