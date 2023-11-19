"use client";

import { Customer } from "@/db/schema";
import {
    CurrencyDollarIcon,
    UserCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import { updateCustomer } from "@/app/lib/customers/actions";
import { useFormState } from "react-dom";

export default function EditCustomerForm({ customer }: { customer: Customer }) {
    const initialState = { message: null, errors: {} };
    // Passing an id as argument won't work
    // <form action={updateCustomer(id)}></form>
    // Instead, you can pass id to the Server Action using JS bind.
    const updateCustomerWithId = updateCustomer.bind(null, customer.id);
    const [state, dispatch] = useFormState(updateCustomerWithId, initialState);

    return (
        <form action={dispatch}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                {/* Customer Name */}
                <div className="mb-4">
                    <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-medium"
                    >
                        Set the name of the customer
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="name"
                                name="name"
                                type="text"
                                defaultValue={customer.name}
                                placeholder="Enter name"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="name-error"
                            />
                            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                        </div>
                    </div>
                    {state.errors?.name ? (
                        <div
                            id="name-error"
                            aria-live="polite"
                            className="mt-2 text-sm text-red-500"
                        >
                            {state.errors.name.map((error: string) => (
                                <p key={error}>{error}</p>
                            ))}
                        </div>
                    ) : null}
                </div>

                {/* Customer Email */}
                <div className="mb-4">
                    <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium"
                    >
                        Set the customer email
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                defaultValue={customer.email}
                                placeholder="Enter email address"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="email-error"
                            />
                            <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                    {state.errors?.email ? (
                        <div
                            id="email-error"
                            aria-live="polite"
                            className="mt-2 text-sm text-red-500"
                        >
                            {state.errors.email.map((error: string) => (
                                <p key={error}>{error}</p>
                            ))}
                        </div>
                    ) : null}
                </div>
                {state.errors ? (
                    <div
                        id="state-error"
                        aria-live="polite"
                        className="mt-2 text-sm text-red-500"
                    >
                        <p key={state.message}>{state.message}</p>
                    </div>
                ) : null}
            </div>
            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/dashboard/customers"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Cancel
                </Link>
                <Button type="submit">Edit Customer</Button>
            </div>
        </form>
    );
}
