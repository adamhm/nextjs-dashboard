import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export function CreateButton({ href, text }: { href: string; text: string }) {
    return (
        <Link
            href={href}
            className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
            <span className="hidden md:block">{text}</span>{" "}
            <PlusIcon className="h-5 md:ml-4" />
        </Link>
    );
}

export function UpdateButton({
    href,
    "sr-text": srText,
}: {
    href: string;
    "sr-text": string;
}) {
    return (
        <Link href={href} className="rounded-md border p-2 hover:bg-gray-100">
            <span className="sr-only">{srText}</span>
            <PencilIcon className="w-5" />
        </Link>
    );
}

export function DeleteButton({
    action,
    "sr-text": srText,
}: {
    action: () => Promise<{ message: string } | undefined>;
    "sr-text": string;
}) {
    return (
        <form action={action}>
            <button className="rounded-md border p-2 hover:bg-gray-100">
                <span className="sr-only">{srText}</span>
                <TrashIcon className="w-5" />
            </button>
        </form>
    );
}
