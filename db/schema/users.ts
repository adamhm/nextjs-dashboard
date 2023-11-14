import { sql } from "drizzle-orm";
import { pgTable, uuid, varchar, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id")
        .default(sql`uuid_generate_v4()`)
        .primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: text("email").unique().notNull(),
    password: text("password").notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
