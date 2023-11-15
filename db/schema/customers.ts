import { sql } from "drizzle-orm";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { z } from "zod";

export const customers = pgTable("customers", {
    id: uuid("id")
        .default(sql`uuid_generate_v4()`)
        .primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    imageUrl: varchar("image_url", { length: 255 }).notNull(),
});

export type Customer = typeof customers.$inferSelect;

export type NewCustomer = typeof customers.$inferInsert;

export const selectCustomerSchema = z.object({
    id: z.string().uuid({ message: "Invalid UUID" }),
    name: z.string().min(1, { message: "This field has to be filled." }),
    email: z.string().email({ message: "Please enter a valid email." }),
    imageUrl: z.string({
        invalid_type_error: "Please select a profile image",
    }),
});

export const insertCustomerSchema = selectCustomerSchema.omit({ id: true });
export const updateCustomerSchema = selectCustomerSchema.omit({
    imageUrl: true,
});
