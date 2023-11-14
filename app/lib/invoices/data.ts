import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";

import { InvoiceForm, InvoicesTable, LatestInvoiceRaw } from "../definitions";
import { formatCurrency } from "../utils";

const ITEMS_PER_PAGE = 6;

export async function fetchLatestInvoices() {
    noStore();
    // Artificially delay a response for demo purposes.
    // Don't do this in real life :)

    // console.log("Fetching invoices data...");
    // await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
        const data = await sql<LatestInvoiceRaw>`
        SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
        FROM invoices
        JOIN customers ON invoices.customer_id = customers.id
        ORDER BY invoices.date DESC
        LIMIT 5`;

        const latestInvoices = data.rows.map((invoice) => ({
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
    currentPage: number
) {
    noStore();

    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    try {
        const invoices = await sql<InvoicesTable>`
            SELECT
                invoices.id,
                invoices.amount,
                invoices.date,
                invoices.status,
                customers.name,
                customers.email,
                customers.image_url
            FROM invoices
            JOIN customers ON invoices.customer_id = customers.id
            WHERE
                customers.name ILIKE ${`%${query}%`} OR
                customers.email ILIKE ${`%${query}%`} OR
                invoices.amount::text ILIKE ${`%${query}%`} OR
                invoices.date::text ILIKE ${`%${query}%`} OR
                invoices.status ILIKE ${`%${query}%`}
            ORDER BY invoices.date DESC
            LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
        `;

        return invoices.rows;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch invoices.");
    }
}

export async function fetchInvoicesPages(query: string) {
    noStore();

    try {
        const count = await sql`SELECT COUNT(*)
            FROM invoices
            JOIN customers ON invoices.customer_id = customers.id
            WHERE
                customers.name ILIKE ${`%${query}%`} OR
                customers.email ILIKE ${`%${query}%`} OR
                invoices.amount::text ILIKE ${`%${query}%`} OR
                invoices.date::text ILIKE ${`%${query}%`} OR
                invoices.status ILIKE ${`%${query}%`}
        `;

        const totalPages = Math.ceil(
            Number(count.rows[0].count) / ITEMS_PER_PAGE
        );
        return totalPages;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch total number of invoices.");
    }
}

export async function fetchInvoiceById(id: string) {
    noStore();

    try {
        const data = await sql<InvoiceForm>`
            SELECT
                invoices.id,
                invoices.customer_id,
                invoices.amount,
                invoices.status
            FROM invoices
            WHERE invoices.id = ${id};
    `;

        const invoice = data.rows.map((invoice) => ({
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
