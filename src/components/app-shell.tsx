
// import React from "react";
// import { SidebarProvider } from "@/components/ui/sidebar";

// type Variant = "header" | "sidebar";

// interface AppShellProps {
//   children: React.ReactNode;
//   variant?: Variant;              // "header" (no sidebar) or "sidebar"
//   defaultSidebarOpen?: boolean;   // initial state for sidebar variant
// }

// export function AppShell({
//   children,
//   variant = "header",
//   defaultSidebarOpen = false,
// }: AppShellProps) {
//   if (variant === "header") {
//     return <div className="flex min-h-screen w-full flex-col">{children}</div>;
//   }

//   return (
//     <SidebarProvider defaultOpen={defaultSidebarOpen}>
//       {children}
//     </SidebarProvider>
//   );
// }
