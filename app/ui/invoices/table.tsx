import Image from "next/image";
import { UpdateButton, DeleteButton } from "@/app/ui/buttons";
import InvoiceStatus from "@/app/ui/invoices/status";
import { formatDateToLocal, formatCurrency } from "@/app/lib/utils";
import { fetchFilteredInvoices } from "@/app/lib/invoices/data";
import { deleteInvoice } from "@/app/lib/invoices/actions";
import {
    InvoicesTable,
    InvoicesTableSortColumn,
    SortDirection,
} from "@/app/lib/definitions";

export default async function InvoicesTable({
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
    const invoices: InvoicesTable[] = await fetchFilteredInvoices(
        query,
        currentPage,
        sortBy as InvoicesTableSortColumn,
        sortDir as SortDirection
    );

    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <div className="md:hidden">
                        {invoices?.map((invoice) => (
                            <div
                                key={invoice.id}
                                className="amb-2 w-full rounded-md bg-white p-4"
                            >
                                <div className="flex items-center justify-between border-b pb-4">
                                    <div>
                                        <div className="mb-2 flex items-center">
                                            <Image
                                                src={invoice.imageUrl}
                                                className="mr-2 rounded-full"
                                                width={28}
                                                height={28}
                                                alt={`${invoice.name}'s profile picture`}
                                            />
                                            <p>{invoice.name}</p>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            {invoice.email}
                                        </p>
                                    </div>
                                    <InvoiceStatus status={invoice.status} />
                                </div>
                                <div className="flex w-full items-center justify-between pt-4">
                                    <div>
                                        <p className="text-xl font-medium">
                                            {formatCurrency(invoice.amount)}
                                        </p>
                                        <p>{formatDateToLocal(invoice.date)}</p>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <UpdateButton
                                            href={`/dashboard/invoices/${invoice.id}/edit`}
                                            sr-text="Update Invoice"
                                        />
                                        <DeleteButton
                                            action={deleteInvoice.bind(
                                                null,
                                                invoice.id
                                            )}
                                            sr-text="Delete Invoice"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <table className="hidden min-w-full text-gray-900 md:table">
                        <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-4 py-5 font-medium sm:pl-6"
                                >
                                    Customer
                                </th>
                                <th
                                    scope="col"
                                    className="px-3 py-5 font-medium"
                                >
                                    Email
                                </th>
                                <th
                                    scope="col"
                                    className="px-3 py-5 font-medium"
                                >
                                    Amount
                                </th>
                                <th
                                    scope="col"
                                    className="px-3 py-5 font-medium"
                                >
                                    Date
                                </th>
                                <th
                                    scope="col"
                                    className="px-3 py-5 font-medium"
                                >
                                    Status
                                </th>
                                <th
                                    scope="col"
                                    className="relative py-3 pl-6 pr-3"
                                >
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {invoices?.map((invoice) => (
                                <tr
                                    key={invoice.id}
                                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                                >
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        <div className="flex items-center gap-3">
                                            <Image
                                                src={invoice.imageUrl}
                                                className="rounded-full"
                                                width={28}
                                                height={28}
                                                alt={`${invoice.name}'s profile picture`}
                                            />
                                            <p>{invoice.name}</p>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {invoice.email}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {formatCurrency(invoice.amount)}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {formatDateToLocal(invoice.date)}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        <InvoiceStatus
                                            status={invoice.status}
                                        />
                                    </td>
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        <div className="flex justify-end gap-3">
                                            <UpdateButton
                                                href={`/dashboard/invoices/${invoice.id}/edit`}
                                                sr-text="Update Invoice"
                                            />
                                            <DeleteButton
                                                action={deleteInvoice.bind(
                                                    null,
                                                    invoice.id
                                                )}
                                                sr-text="Delete Invoice"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
