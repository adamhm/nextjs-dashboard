"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export type CustomerState = {
    errors?: {
        name?: string[];
        email?: string[];
        image_url?: string[];
    };
    message?: string | null;
};

const CustomerSchema = z.object({
    id: z.string(),
    name: z.string().min(1, { message: "This field has to be filled." }),
    email: z.string().email({ message: "Please enter a valid email." }),
    image_url: z.string({
        invalid_type_error: "Please select a profile image",
    }),
});

export async function createCustomer(
    prevState: CustomerState,
    formData: FormData
) {
    // validating form data with Zod
    const validatedFields = CustomerSchema.omit({ id: true }).safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        image_url: formData.get("image_url"),
    });

    if (!validatedFields.success) {
        return {
            message: "Missing Fields. Failed to Create Customer.",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { name, email, image_url } = validatedFields.data;

    // insert the new customer into the database
    try {
        await sql`
            INSERT INTO customers (name, email, image_url)
            VALUES (${name}, ${email}, ${image_url})
        `;
    } catch (err) {
        return { message: "Database Error: Failed to Create Customer." };
    }

    revalidatePath("/dashboard/customers");

    redirect("/dashboard/customers");
}

const UpdateCustomer = CustomerSchema.omit({ id: true });

export async function updateCustomer(
    id: string,
    prevState: CustomerState,
    formData: FormData
) {
    const validatedFields = UpdateCustomer.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing fields. Failed to update customer.",
        };
    }

    const { name, email } = validatedFields.data;

    try {
        await sql`
            UPDATE customers
            SET name = ${name}, email = ${email}
            WHERE id = ${id}
        `;
    } catch (err) {
        return { message: "Database Error: Failed to Update Customer." };
    }

    revalidatePath("/dashboard/customers");

    /* redirect is being called outside of the try/catch block. This is because redirect
    works by throwing an error, which would be caught by the catch block. To avoid this,
    you can call redirect after try/catch. */
    redirect("/dashboard/customers");
}
