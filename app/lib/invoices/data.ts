import { unstable_noStore as noStore } from "next/cache";
import { sql, ilike, or, asc, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { invoices, customers } from "@/db/schema";
import {
    InvoiceForm,
    InvoicesTable,
    InvoicesTableSortColumn,
    LatestInvoice,
    LatestInvoiceRaw,
    SortColumn,
    SortDirection,
} from "../definitions";
import { formatCurrency } from "../utils";

const ITEMS_PER_PAGE = 6;

export async function fetchLatestInvoices() {
    noStore();

    try {
        const data: LatestInvoiceRaw[] = await db
            .select({
                id: invoices.id,
                amount: invoices.amount,
                name: customers.name,
                email: customers.email,
                imageUrl: customers.imageUrl,
            })
            .from(invoices)
            .innerJoin(customers, eq(invoices.customerId, customers.id))
            .orderBy(desc(invoices.date))
            .limit(5);

        const latestInvoices: LatestInvoice[] = data.map((invoice) => ({
            ...invoice,
            amount: formatCurrency(invoice.amount),
        }));

        return latestInvoices;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch the latest invoices.");
    }
}

export async function fetchFilteredInvoices(
    query: string,
    currentPage: number,
    sortBy: InvoicesTableSortColumn = "date",
    sortDir: SortDirection = "DESC"
) {
    noStore();

    const sortColumns = new Map<InvoicesTableSortColumn, SortColumn>([
        ["customer", customers.name],
        ["name", customers.name],
        ["email", customers.email],
        ["amount", invoices.amount],
        ["date", invoices.date],
        ["status", invoices.status],
    ]);

    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    const sortDirFn = (sortDir.toLowerCase() === "desc" ? desc : asc) || asc;
    const sortColumn = sortColumns.get(sortBy) || invoices.date;

    try {
        const result: InvoicesTable[] = await db
            .select({
                id: invoices.id,
                amount: invoices.amount,
                date: invoices.date,
                status: sql<"pending" | "paid">`${invoices.status}`,
                name: customers.name,
                email: customers.email,
                imageUrl: customers.imageUrl,
            })
            .from(invoices)
            .innerJoin(customers, eq(invoices.customerId, customers.id))
            .where(
                or(
                    ilike(customers.name, `%${query}%`),
                    ilike(customers.email, `%${query}%`),
                    sql`${invoices.amount}::text ILIKE ${`%${query}%`}`,
                    sql`${invoices.date}::text ILIKE ${`%${query}%`}`,
                    ilike(invoices.status, `%${query}%`)
                )
            )
            .orderBy(sortDirFn(sortColumn))
            .limit(ITEMS_PER_PAGE)
            .offset(offset);

        return result;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch invoices.");
    }
}

export async function fetchInvoicesPages(query: string) {
    noStore();

    try {
        const count = (
            await db
                .select({
                    count: sql<number>`cast(count(*) as int)`,
                })
                .from(invoices)
                .innerJoin(customers, eq(invoices.customerId, customers.id))
                .where(
                    or(
                        ilike(customers.name, `%${query}%`),
                        ilike(customers.email, `%${query}%`),
                        sql`${invoices.amount}::text ILIKE ${`%${query}%`}`,
                        sql`${invoices.date}::text ILIKE ${`%${query}%`}`,
                        sql`${invoices.status} ILIKE ${`%${query}%`}`
                    )
                )
        )[0].count;
        const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

        return totalPages;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch total number of invoices.");
    }
}

export async function fetchInvoiceById(id: string) {
    noStore();

    try {
        const data: InvoiceForm[] = await db
            .select({
                id: invoices.id,
                customerId: invoices.customerId,
                amount: invoices.amount,
                status: invoices.status,
            })
            .from(invoices)
            .where(eq(invoices.id, id));

        const invoice = data.map((invoice) => ({
            ...invoice,
            // Convert amount from cents to dollars
            amount: invoice.amount / 100,
        }));

        return invoice[0];
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error(`Failed to fetch the invoice (id: ${id}).`);
    }
}
