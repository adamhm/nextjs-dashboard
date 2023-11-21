import { sql } from "@vercel/postgres";
import { drizzle as vercelDrizzle } from "drizzle-orm/vercel-postgres";
import { drizzle as pgDrizzle } from "drizzle-orm/postgres-js";
import { pgClient } from "./pg-local";

export const db =
    process.env.DB_FROM && process.env.DB_FROM === "local"
        ? pgDrizzle(pgClient)
        : vercelDrizzle(sql);
