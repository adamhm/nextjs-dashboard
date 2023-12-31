import { Suspense } from "react";

import { CustomersTableSkeleton } from "@/app/ui/customers/skeletons";
import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import CustomersTable from "@/app/ui/customers/table";
import Pagination from "@/app/ui/pagination";
import { fetchCustomersPages } from "@/app/lib/customers/data";
import { CreateButton } from "@/app/ui/buttons";

export default async function Page({
    searchParams,
}: {
    searchParams?: {
        query?: string;
        page?: string;
        sortBy?: string;
        sortDir?: string;
    };
}) {
    const query = searchParams?.query || "";
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchCustomersPages(query);

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>Customers</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search Customers..." />
                <CreateButton
                    href="/dashboard/customers/create"
                    text="Create Customer"
                />
            </div>
            <Suspense
                key={query + currentPage}
                fallback={<CustomersTableSkeleton />}
            >
                <CustomersTable
                    query={query}
                    currentPage={currentPage}
                    sortBy={searchParams?.sortBy}
                    sortDir={searchParams?.sortDir}
                />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}
