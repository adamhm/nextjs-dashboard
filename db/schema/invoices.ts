import { sql } from "drizzle-orm";
import { pgTable, uuid, integer, varchar, date } from "drizzle-orm/pg-core";

export const invoices = pgTable("invoices", {
    id: uuid("id")
        .default(sql`uuid_generate_v4()`)
        .primaryKey(),
    customerId: uuid("customer_id").notNull(),
    amount: integer("amount").notNull(),
    status: varchar("status", { length: 255 }).notNull(),
    date: date("date").notNull(),
});

export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
