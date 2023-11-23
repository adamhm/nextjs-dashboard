"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
    ArrowDownAZIcon,
    ArrowUpZAIcon,
    ArrowDownUpIcon,
    ArrowDown01Icon,
    ArrowUp10Icon,
} from "lucide-react";
import {
    CustomersTableSortColumn,
    InvoicesTableSortColumn,
    SortDirection,
} from "../lib/definitions";
import clsx from "clsx";

type SortProps<TColumn> = {
    title: string;
    column: TColumn;
    type?: "string" | "numeric";
};

export default function ColumnSort<TColumn>({
    title,
    column,
    type = "string",
}: SortProps<TColumn>) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentSortBy = searchParams.get("sortBy");
    const currentSortDir = searchParams.get("sortDir");

    const params = new URLSearchParams(searchParams);

    let pageURL: string;
    let sortDir: SortDirection;

    if (column === currentSortBy) {
        sortDir = currentSortDir?.toLowerCase() === "desc" ? "ASC" : "DESC";
        params.set("sortDir", sortDir);
    } else {
        sortDir = "ASC";
        params.set("sortBy", column as string);
        params.set("sortDir", sortDir);
    }

    pageURL = `${pathname}?${params.toString()}`;

    const icon =
        currentSortBy === column ? (
            currentSortDir === "ASC" ? (
                type === "string" ? (
                    <ArrowDownAZIcon
                        size={24}
                        className="ml-auto h-5 font-bold"
                    />
                ) : (
                    <ArrowDown01Icon
                        size={24}
                        className="ml-auto h-5 font-bold"
                    />
                )
            ) : type === "string" ? (
                <ArrowUpZAIcon size={24} className="ml-auto h-5 font-bold" />
            ) : (
                <ArrowUp10Icon size={24} className="ml-auto h-5 font-bold" />
            )
        ) : (
            <ArrowDownUpIcon className="ml-auto h-5 text-gray-500" />
        );

    return (
        <Link
            href={pageURL}
            aria-label={`Order the table by ${title}`}
            className={clsx("w-full flex items-center text-[16px]", {
                "text-blue-600": currentSortBy === column,
                "font-bold": currentSortBy === column,
            })}
        >
            {title}
            {icon}
        </Link>
    );
}

export const CustomerColumnSort = ({
    title,
    column,
    type = "string",
}: {
    title: string;
    column: CustomersTableSortColumn;
    type?: "string" | "numeric";
}) => {
    return (
        <ColumnSort<CustomersTableSortColumn>
            title={title}
            column={column}
            type={type}
        />
    );
};

export const InvoiceColumnSort = ({
    title,
    column,
    type = "string",
}: {
    title: string;
    column: InvoicesTableSortColumn;
    type?: "string" | "numeric";
}) => {
    return (
        <ColumnSort<InvoicesTableSortColumn>
            title={title}
            column={column}
            type={type}
        />
    );
};
