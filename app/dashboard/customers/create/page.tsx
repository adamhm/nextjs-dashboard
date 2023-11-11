import Form from "@/app/ui/customers/create-form";
import Breadcrumbs from "@/app/ui/breadcrumbs";

export default async function Page() {
    return (
        <main className="max-w-[768px]">
            <Breadcrumbs
                breadcrumbs={[
                    { label: "Invoices", href: "/dashboard/customers" },
                    {
                        label: "Create Customer",
                        href: "/dashboard/customers/create",
                        active: true,
                    },
                ]}
            />
            <Form />
        </main>
    );
}
