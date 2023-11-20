import { unstable_noStore as noStore } from "next/cache";
import { asc, desc, sql, eq, ilike, or } from "drizzle-orm";

import { db } from "@/db";
import { customers, invoices, type Customer } from "@/db/schema";

import {
    CustomerField,
    CustomersTable,
    CustomersTableSortColumn,
    SortColumn,
    SortDirection,
} from "../definitions";
import { formatCurrency } from "../utils";

const ITEMS_PER_PAGE = 6;

export async function fetchCustomers() {
    noStore();

    try {
        const result: CustomerField[] = await db
            .select({
                id: customers.id,
                name: customers.name,
            })
            .from(customers)
            .orderBy(asc(customers.name));

        return result;
    } catch (err) {
        console.error("Database Error:", err);
        throw new Error("Failed to fetch all customers.");
    }
}

export async function fetchCustomersPages(query: string) {
    noStore();

    try {
        const count = (
            await db
                .select({ count: sql<number>`cast(count(*) as int)` })
                .from(customers)
                .where(
                    or(
                        ilike(customers.name, `%${query}%`),
                        ilike(customers.email, `%${query}%`)
                    )
                )
        )[0].count;

        const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

        return totalPages;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch total number of customers.");
    }
}

export async function fetchFilteredCustomers(
    query: string,
    currentPage: number,
    sortBy: CustomersTableSortColumn = "name",
    sortDir: SortDirection = "ASC"
) {
    noStore();

    const sortColumns = new Map<CustomersTableSortColumn, SortColumn>([
        ["name", customers.name],
        ["email", customers.email],
        ["totalInvoices", sql`totalInvoices`],
        ["totalPending", sql`totalPending`],
        ["totalPaid", sql`totalPaid`],
    ]);

    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    const sortDirFn = (sortDir.toLowerCase() === "desc" ? desc : asc) || asc;
    const sortColumn = sortColumns.get(sortBy) || customers.name;

    try {
        const data: CustomersTable[] = await db
            .select({
                id: customers.id,
                name: customers.name,
                email: customers.email,
                imageUrl: customers.imageUrl,
                totalInvoices: sql<number>`cast(count(${invoices.id}) as int) as totalInvoices`,
                totalPending: sql<number>`SUM(CASE WHEN ${invoices.status} = 'pending' THEN ${invoices.amount} ELSE 0 END) as totalPending`,
                totalPaid: sql<number>`SUM(CASE WHEN ${invoices.status} = 'paid' THEN ${invoices.amount} ELSE 0 END) as totalPaid`,
            })
            .from(customers)
            .leftJoin(invoices, eq(customers.id, invoices.customerId))
            .where(
                or(
                    ilike(customers.name, `%${query}%`),
                    ilike(customers.email, `%${query}%`)
                )
            )
            .groupBy(
                customers.id,
                customers.name,
                customers.email,
                customers.imageUrl
            )
            .orderBy(sortDirFn(sortColumn))
            .limit(ITEMS_PER_PAGE)
            .offset(offset);

        const result = data.map((customer) => ({
            ...customer,
            totalPending: formatCurrency(customer.totalPending),
            totalPaid: formatCurrency(customer.totalPaid),
        }));

        return result;
    } catch (err) {
        console.error("Database Error:", err);
        throw new Error("Failed to fetch customer table.");
    }
}

export async function fetchCustomerById(id: string) {
    noStore();

    try {
        const data: Customer[] = await db
            .select({
                id: customers.id,
                name: customers.name,
                email: customers.email,
                imageUrl: customers.imageUrl,
            })
            .from(customers)
            .where(eq(customers.id, id));

        return data[0];
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error(`Failed to fetch the customer (id: ${id}).`);
    }
}
