import { sql } from "drizzle-orm";
import { pgTable, uuid, integer, varchar, date } from "drizzle-orm/pg-core";
import { z } from "zod";

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

export const selectInvoiceSchema = z.object({
    id: z.string().uuid({ message: "Invalid UUID" }),
    customerId: z.string({
        invalid_type_error: "Please select a customer.",
    }),
    amount: z.coerce
        .number()
        .gt(0, { message: "Please enter an amount greater than $0." }),
    status: z.enum(["pending", "paid"], {
        invalid_type_error: "Please select an invoice status.",
    }),
    date: z.string(),
});

export const insertInvoiceSchema = selectInvoiceSchema.omit({
    id: true,
    date: true,
});

export const updateInvoiceSchema = selectInvoiceSchema.omit({ date: true });
