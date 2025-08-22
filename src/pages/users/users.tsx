// // src/pages/users/UsersPage.tsx (rename as you like)
// import { useEffect } from "react";
// import { DataTable } from "@/components/ui/data-table";
// import AppLayout from "@/layouts/app-layout";
// import type { BreadcrumbItem } from "@/types";
// import { columns, type User } from "./columns";

// const breadcrumbs: BreadcrumbItem[] = [
//   { title: "Users", href: "/users" },
// ];

// function fetchUsers(): User[] {
//   return [
//     { id: 1, name: "John Doe",  email: "john@test.com" },
//     { id: 2, name: "Jane Smith", email: "Jane@test.com" },
//   ];
// }

// export default function UsersPage() {
//   // replace <Head title="Users" /> from Inertia
//   useEffect(() => {
//     document.title = "Users";
//   }, []);

//   const data = fetchUsers();

//   return (
//     <AppLayout breadcrumbs={breadcrumbs}>
//       <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
//         <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border px-4 py-4">
//           <DataTable columns={columns} data={data} />
//         </div>
//       </div>
//     </AppLayout>
//   );
// }
