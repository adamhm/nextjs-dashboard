"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import {
    customers,
    insertCustomerSchema,
    updateCustomerSchema,
} from "@/db/schema";

export type CustomerState = {
    errors?: {
        name?: string[];
        email?: string[];
        image_url?: string[];
    };
    message?: string | null;
};

export async function createCustomer(
    _prevState: CustomerState,
    formData: FormData
) {
    // validating form data with Zod
    const validatedFields = insertCustomerSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        imageUrl: formData.get("image_url"),
    });

    if (!validatedFields.success) {
        return {
            message: "Missing Fields. Failed to Create Customer.",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { name, email, imageUrl } = validatedFields.data;

    // insert the new customer into the database
    try {
        await db.insert(customers).values({ name, email, imageUrl });
    } catch (err) {
        return { message: "Database Error: Failed to Create Customer." };
    }

    revalidatePath("/dashboard/customers");

    redirect("/dashboard/customers");
}

export async function updateCustomer(
    id: string,
    _prevState: CustomerState,
    formData: FormData
) {
    const validatedFields = updateCustomerSchema.safeParse({
        id,
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
        await db
            .update(customers)
            .set({ name, email })
            .where(eq(customers.id, id));
    } catch (err) {
        return { message: "Database Error: Failed to Update Customer." };
    }

    revalidatePath("/dashboard/customers");

    /* redirect is being called outside of the try/catch block. This is because redirect
    works by throwing an error, which would be caught by the catch block. To avoid this,
    you can call redirect after try/catch. */
    redirect("/dashboard/customers");
}
