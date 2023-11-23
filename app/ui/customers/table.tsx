import Image from "next/image";
import {
    CustomersTable,
    CustomersTableSortColumn,
    SortDirection,
} from "@/app/lib/definitions";
import { fetchFilteredCustomers } from "@/app/lib/customers/data";
import { UpdateButton } from "../buttons";
import { CustomerColumnSort } from "../sort";

export default async function CustomersTable({
    query,
    currentPage,
    sortBy,
    sortDir,
}: {
    query: string;
    currentPage: number;
    sortBy?: string;
    sortDir?: string;
}) {
    const customers = await fetchFilteredCustomers(
        query,
        currentPage,
        sortBy as CustomersTableSortColumn,
        sortDir as SortDirection
    );

    return (
        <div className="mt-6 flow-root">
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden rounded-md bg-gray-50 md:pt-0 border">
                        <div className="md:hidden">
                            {customers?.map((customer) => (
                                <div
                                    key={customer.id}
                                    className="mb-2 w-full rounded-md bg-white p-4"
                                >
                                    <div className="flex items-center justify-between border-b pb-4">
                                        <div>
                                            <div className="mb-2 flex items-center">
                                                <div className="flex items-center gap-3">
                                                    <Image
                                                        src={customer.imageUrl}
                                                        className="rounded-full"
                                                        alt={`${customer.name}'s profile picture`}
                                                        width={28}
                                                        height={28}
                                                    />
                                                    <p>{customer.name}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                {customer.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex w-full items-center justify-between border-b py-5">
                                        <div className="flex w-1/2 flex-col">
                                            <p className="text-xs">Pending</p>
                                            <p className="font-medium">
                                                {customer.totalPending}
                                            </p>
                                        </div>
                                        <div className="flex w-1/2 flex-col">
                                            <p className="text-xs">Paid</p>
                                            <p className="font-medium">
                                                {customer.totalPaid}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="pt-4 text-sm">
                                        <p>{customer.totalInvoices} invoices</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                            <thead className="rounded-md bg-gray-50 text-left text-sm font-normal border-b">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-4 py-5 font-medium sm:pl-6"
                                    >
                                        <CustomerColumnSort
                                            title="Name"
                                            column="name"
                                        />
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-5 font-medium border-x"
                                    >
                                        <CustomerColumnSort
                                            title="Email"
                                            column="email"
                                        />
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-5 font-medium border-x"
                                    >
                                        <CustomerColumnSort
                                            title="Total Invoices"
                                            column="totalInvoices"
                                            type="numeric"
                                        />
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-5 font-medium border-x"
                                    >
                                        <CustomerColumnSort
                                            title="Total Pending"
                                            column="totalPending"
                                            type="numeric"
                                        />
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-5 font-medium border-x"
                                    >
                                        <CustomerColumnSort
                                            title="Total Paid"
                                            column="totalPaid"
                                            type="numeric"
                                        />
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 text-gray-900">
                                {customers.map((customer) => (
                                    <tr key={customer.id} className="group">
                                        <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6 border-r">
                                            <div className="flex items-center gap-3">
                                                <Image
                                                    src={customer.imageUrl}
                                                    className="rounded-full"
                                                    alt={`${customer.name}'s profile picture`}
                                                    width={28}
                                                    height={28}
                                                />
                                                <p>{customer.name}</p>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap bg-white px-4 py-5 text-sm border-r">
                                            {customer.email}
                                        </td>
                                        <td className="whitespace-nowrap bg-white px-4 py-5 text-sm border-r">
                                            {customer.totalInvoices}
                                        </td>
                                        <td className="whitespace-nowrap bg-white px-4 py-5 text-sm border-r">
                                            {customer.totalPending}
                                        </td>
                                        <td className="whitespace-nowrap bg-white px-4 py-5 text-sm group-first-of-type:rounded-md group-last-of-type:rounded-md border-r">
                                            {customer.totalPaid}
                                        </td>
                                        <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                            <div className="flex justify-end gap-3">
                                                <UpdateButton
                                                    href={`/dashboard/customers/${customer.id}/edit`}
                                                    sr-text="Update Invoice"
                                                />
                                                {/*<DeleteButton
                                                    action={deleteInvoice.bind(
                                                        null,
                                                        invoice.id
                                                    )}
                                                    sr-text="Delete Invoice"
                                                    />*/}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
