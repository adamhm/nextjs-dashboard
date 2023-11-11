"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { signIn } from "@/auth";

const InvoiceSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: "Please select a customer.",
    }),
    amount: z.coerce
        .number()
        .gt(0, { message: "Please enter an amount greater than $0." }),
    status: z.enum(["pending", "paid"], {
        invalid_type_error: "Please select an invoice status.",
    }),
    date: z.string(),
});

const CreateInvoice = InvoiceSchema.omit({ id: true, date: true });

// This is temporary until @types/react-dom is updated
export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
    // Validate form fields using Zod
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get("customerId"),
        amount: formData.get("amount"),
        status: formData.get("status"),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Create Invoice.",
        };
    }

    // Prepare data for insertion into the database
    const { customerId, amount, status } = validatedFields.data;

    // store monetary values in cents in your database to eliminate JavaScript
    // floating - point errors
    const amountInCents = amount * 100;

    // create a new date with the format "YYYY-MM-DD" for the invoice's creation date
    const date = new Date().toISOString().split("T")[0];

    // insert the new invoice into the database
    try {
        await sql`
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
    } catch (err) {
        return { message: "Database Error: Failed to Create Invoice." };
    }

    // Since you're updating the data displayed in the invoices route, you want to clear
    // this cache and trigger a new request to the server.
    // Once the database has been updated, the /dashboard/invoices path will be revalidated,
    // and fresh data will be fetched from the server.
    revalidatePath("/dashboard/invoices");

    // redirect the user back to the /dashboard/invoices page
    redirect("/dashboard/invoices");
}

const UpdateInvoice = InvoiceSchema.omit({ date: true, id: true });

export async function updateInvoice(
    id: string,
    prevState: State,
    formData: FormData
) {
    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get("customerId"),
        amount: formData.get("amount"),
        status: formData.get("status"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing fields. Failed to update invoice.",
        };
    }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;

    try {
        await sql`
            UPDATE invoices
            SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
            WHERE id = ${id}
        `;
    } catch (err) {
        return { message: "Database Error: Failed to Update Invoice." };
    }

    revalidatePath("/dashboard/invoices");

    /* redirect is being called outside of the try/catch block. This is because redirect
    works by throwing an error, which would be caught by the catch block. To avoid this,
    you can call redirect after try/catch. */
    redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;

        // Calling revalidatePath will trigger a new server request and re-render the table.
        revalidatePath("/dashboard/invoices");
    } catch (err) {
        return { message: "Database Error: Failed to Delete Invoice" };
    }
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData
) {
    try {
        await signIn("credentials", Object.fromEntries(formData));
    } catch (error) {
        if ((error as Error).message.includes("CredentialSignin")) {
            return "CredentialSignin";
        }
        throw error;
    }
}
