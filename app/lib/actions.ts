"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const InvoiceSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(["pending", "paid"]),
    date: z.string(),
});

const CreateInvoice = InvoiceSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get("customerId"),
        amount: formData.get("amount"),
        status: formData.get("status"),
    });

    // store monetary values in cents in your database to eliminate JavaScript
    // floating - point errors
    const amountInCents = amount * 100;

    // create a new date with the format "YYYY-MM-DD" for the invoice's creation date
    const date = new Date().toISOString().split("T")[0];

    // insert the new invoice into the database
    await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;

    // Since you're updating the data displayed in the invoices route, you want to clear
    // this cache and trigger a new request to the server.
    // Once the database has been updated, the /dashboard/invoices path will be revalidated,
    // and fresh data will be fetched from the server.
    revalidatePath("/dashboard/invoices");

    // redirect the user back to the /dashboard/invoices page
    redirect("/dashboard/invoices");
}

const UpdateInvoice = InvoiceSchema.omit({ date: true, id: true });

export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
        customerId: formData.get("customerId"),
        amount: formData.get("amount"),
        status: formData.get("status"),
    });

    const amountInCents = amount * 100;

    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
    `;

    revalidatePath("/dashboard/invoices");
    redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
    await sql`DELETE FROM invoices WHERE id = ${id}`;

    // Calling revalidatePath will trigger a new server request and re-render the table.
    revalidatePath("/dashboard/invoices");
}
