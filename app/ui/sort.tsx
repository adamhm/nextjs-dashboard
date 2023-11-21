"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
    ChevronUpDownIcon,
    ChevronUpIcon,
    ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { CustomersTableSortColumn, SortDirection } from "../lib/definitions";

type SortProps<TColumn> = {
    title: string;
    sortBy: TColumn;
};

export default function Sort<TColumn>({ title, sortBy }: SortProps<TColumn>) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentSortBy = searchParams.get("sortBy");
    const currentSortDir = searchParams.get("sortDir");

    const params = new URLSearchParams(searchParams);

    let pageURL: string;
    let sortDir: SortDirection;

    if (sortBy === currentSortBy) {
        sortDir = currentSortDir?.toLowerCase() === "desc" ? "ASC" : "DESC";
        params.set("sortDir", sortDir);
    } else {
        sortDir = "ASC";
        params.set("sortBy", sortBy as string);
        params.set("sortDir", sortDir);
    }

    pageURL = `${pathname}?${params.toString()}`;

    const icon =
        sortBy === currentSortBy ? (
            sortDir === "ASC" ? (
                <ChevronUpIcon className="ml-auto h-4 text-black font-bold" />
            ) : (
                <ChevronDownIcon className="ml-auto h-4 text-black font-bold" />
            )
        ) : (
            <ChevronUpDownIcon className="ml-auto h-6 text-black" />
        );

    return (
        <Link href={pageURL} className="w-full flex items-center">
            {title}
            {icon}
        </Link>
    );
}

export const CustomerSort = ({
    title,
    sortBy,
}: {
    title: string;
    sortBy: CustomersTableSortColumn;
}) => {
    return <Sort<CustomersTableSortColumn> title={title} sortBy={sortBy} />;
};
