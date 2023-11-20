import { SQL } from "drizzle-orm";
import { PgColumn } from "drizzle-orm/pg-core";

import { Customer, Invoice } from "@/db/schema";

export type LatestInvoiceRaw = Customer & Pick<Invoice, "amount">;

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoice = { [K in keyof LatestInvoiceRaw]: string };

export type InvoicesTable = Omit<Invoice, "customerId"> & Omit<Customer, "id">;

export type InvoicesTableSortColumn =
    | keyof Pick<InvoicesTable, "name" | "email" | "date" | "amount" | "status">
    | "customer";

export type CustomersTable = Customer & {
    totalInvoices: number;
    totalPending: number;
    totalPaid: number;
};

export type CustomersTableSortColumn = keyof Pick<
    CustomersTable,
    "name" | "email" | "totalInvoices" | "totalPending" | "totalPaid"
>;

export type CustomerField = Pick<Customer, "id" | "name">;

export type InvoiceForm = Omit<Invoice, "date">;

export type SortColumn = PgColumn | SQL<unknown>;

export type SortDirection = "ASC" | "DESC";
