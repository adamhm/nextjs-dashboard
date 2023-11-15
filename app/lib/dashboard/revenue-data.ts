import { unstable_noStore as noStore } from "next/cache";

import { db } from "@/db";
import { revenue, type Revenue } from "@/db/schema";

export async function fetchRevenue() {
    // Add noStore() here prevent the response from being cached.
    // This is equivalent to in fetch(..., {cache: 'no-store'}).
    noStore();

    try {
        const data: Revenue[] = await db.select().from(revenue);

        return data;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch revenue data.");
    }
}
