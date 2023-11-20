import { SQL } from "drizzle-orm";
import { PgColumn } from "drizzle-orm/pg-core";

import { Invoice } from "@/db/schema";

export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
};

export type LatestInvoice = {
    id: string;
    name: string;
    imageUrl: string;
    email: string;
    amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, "amount"> & {
    amount: number;
};

export type InvoicesTable = {
    id: string;
    name: string;
    email: string;
    imageUrl: string;
    date: string;
    amount: number;
    status: "pending" | "paid";
};

export type InvoicesTableSortColumn =
    | keyof Pick<InvoicesTable, "name" | "email" | "date" | "amount" | "status">
    | "customer";

export type CustomersTable = {
    id: string;
    name: string;
    email: string;
    imageUrl: string;
    totalInvoices: number;
    totalPending: number;
    totalPaid: number;
};

export type CustomersTableSortColumn = keyof Pick<
    CustomersTable,
    "name" | "email" | "totalInvoices" | "totalPending" | "totalPaid"
>;

export type CustomerField = {
    id: string;
    name: string;
};

export type InvoiceForm = Omit<Invoice, "date">;

export type SortColumn = PgColumn | SQL<unknown>;
export type SortDirection = "ASC" | "DESC";
