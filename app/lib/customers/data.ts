import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";
import {
    Customer,
    CustomerField,
    CustomersTable,
    SortColumn,
    SortDirection,
} from "../definitions";
import { formatCurrency } from "../utils";

const ITEMS_PER_PAGE = 6;

export async function fetchCustomers() {
    noStore();

    try {
        const data = await sql<CustomerField>`
            SELECT
                id,
                name
            FROM customers
            ORDER BY name ASC
    `;

        const customers = data.rows;
        return customers;
    } catch (err) {
        console.error("Database Error:", err);
        throw new Error("Failed to fetch all customers.");
    }
}

export async function fetchCustomersPages(query: string) {
    noStore();

    try {
        const count = await sql`SELECT COUNT(*)
            FROM customers
            WHERE
                name ILIKE ${`%${query}%`} OR
                email ILIKE ${`%${query}%`}
        `;

        const totalPages = Math.ceil(
            Number(count.rows[0].count) / ITEMS_PER_PAGE
        );
        return totalPages;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch total number of customers.");
    }
}

export async function fetchFilteredCustomers(
    query: string,
    currentPage: number,
    sortBy: SortColumn<Customer>,
    sortDir: SortDirection
) {
    noStore();

    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const x = "DESC";
    try {
        const data = await sql<CustomersTable>`
            SELECT
                customers.id,
                customers.name,
                customers.email,
                customers.image_url,
                COUNT(invoices.id) AS total_invoices,
                SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
                SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
            FROM customers
            LEFT JOIN invoices ON customers.id = invoices.customer_id
            WHERE
            customers.name ILIKE ${`%${query}%`} OR
            customers.email ILIKE ${`%${query}%`}
            GROUP BY customers.id, customers.name, customers.email, customers.image_url
            ORDER BY customers.name DESC
            LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
        `;

        const customers = data.rows.map((customer) => ({
            ...customer,
            total_pending: formatCurrency(customer.total_pending),
            total_paid: formatCurrency(customer.total_paid),
        }));

        return customers;
    } catch (err) {
        console.error("Database Error:", err);
        throw new Error("Failed to fetch customer table.");
    }
}

export async function fetchCustomerById(id: string) {
    noStore();

    try {
        const data = await sql<Customer>`
            SELECT
                id,
                name,
                email,
                image_url
            FROM customers
            WHERE id = ${id};
        `;

        return data.rows[0];
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error(`Failed to fetch the customer (id: ${id}).`);
    }
}
