// import { Outlet, useLocation } from "react-router-dom"
// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
// import { AppSidebar } from "@/components/app-sidebar"
// import { AppHeader } from "@/components/app-header"
// import type { BreadcrumbItem, User as AppUser } from "@/types"
// import { AppSidebarHeader } from "@/components/app-sidebar-header"
// import { APP_CONTAINER, APP_HEADER_HEIGHT } from "@/lib/layout"

// const currentUser: AppUser = {
//   id: 1,
//   name: "Demo User",
//   email: "demo@example.com",
//   created_at: new Date().toISOString(),
//   updated_at: new Date().toISOString(),
// }

// export default function ShellWithSidebar() {
//   const { pathname } = useLocation()

//   const breadcrumbsMap: Record<string, BreadcrumbItem[]> = {
//     "/dashboard": [{ title: "Dashboard", href: "/dashboard" }],
    
//       "/token-bills/card-bins": [
//         { title: "Dashboard", href: "/dashboard" },
//         { title: "Token Bill Management", href: "/token-bills/card-bins" },
//         { title: "Card BINs", href: "/token-bills/card-bins" },
//         ],
//   "/token-bills/account-bins": [
//         { title: "Dashboard", href: "/dashboard" },
//         { title: "Token Bill Management", href: "/token-bills/account-bins" },
//         { title: "Account BINs", href: "/token-bills/account-bins" },
//       ],

//     "/profile": [
//       { title: "Dashboard", href: "/dashboard" },
//       { title: "Profile Management", href: "/profile" },
//     ],
//     "/instances": [
//       { title: "Dashboard", href: "/dashboard" },
//       { title: "Instance Management", href: "/instances" },
//     ],
//     "/tokens": [
//       { title: "Dashboard", href: "/dashboard" },
//       { title: "Token Management", href: "/tokens" },
//     ],
//     "/reports": [
//       { title: "Dashboard", href: "/dashboard" },
//       { title: "Reporting", href: "/reports" },
//     ],
//      "/settings/profile": [
//     { title: "Dashboard", href: "/dashboard" },
//     { title: "Settings", href: "/settings/profile" },
//     { title: "Profile", href: "/settings/profile" },
//       ],
//       "/settings/appearance": [
//         { title: "Dashboard", href: "/dashboard" },
//         { title: "Settings", href: "/settings/appearance" },
//         { title: "Appearance", href: "/settings/appearance" },
//       ],
//   }
//   const breadcrumbs = breadcrumbsMap[pathname] ?? []

//   return (
//      <SidebarProvider>
//       {/* Page background uses the global background token */}
//       <div className="flex min-h-screen bg-background">
//           <AppSidebar user={currentUser} />

//         {/* Content column gets a subtle panel background */}
//         <div className="flex-1 min-w-0 flex flex-col bg-muted/40" >
//            {/* <SidebarTrigger className="m-2" /> */}
//           <AppHeader breadcrumbs={breadcrumbs} />
//           <main className="flex-1 ">
//             <div className="w-full mx-auto max-w-7xl px-6 py-6 min-h-[calc(100vh-64px)] flex flex-col">
//               <Outlet />
//             </div>
//           </main>
//         </div>
//       </div>
//     </SidebarProvider>
//   )
// }


import { Outlet, useLocation } from "react-router-dom"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AppSidebarHeader } from "@/components/app-sidebar-header"
import type { BreadcrumbItem, User as AppUser } from "@/types"
import { APP_CONTAINER, APP_HEADER_HEIGHT } from "@/lib/layout"

const currentUser: AppUser = {
  id: 1,
  name: "Demo User",
  email: "demo@example.com",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export default function ShellWithSidebar() {
  const { pathname } = useLocation()

  const breadcrumbsMap: Record<string, BreadcrumbItem[]> = {
    "/dashboard": [{ title: "Dashboard", href: "/dashboard" }],

    "/token-bills/card-bins": [
      { title: "Dashboard", href: "/dashboard" },
      { title: "Token Bill Management", href: "/token-bills/card-bins" },
      { title: "Card BINs", href: "/token-bills/card-bins" },
    ],

    "/token-bills/account-bins": [
      { title: "Dashboard", href: "/dashboard" },
      { title: "Token Bill Management", href: "/token-bills/account-bins" },
      { title: "Account BINs", href: "/token-bills/account-bins" },
    ],

    "/profile": [
      { title: "Dashboard", href: "/dashboard" },
      { title: "Profile Management", href: "/profile" },
    ],
    "/instances": [
      { title: "Dashboard", href: "/dashboard" },
      { title: "Instance Management", href: "/instances" },
    ],
    "/tokens": [
      { title: "Dashboard", href: "/dashboard" },
      { title: "Token Management", href: "/tokens" },
    ],
    "/reports": [
      { title: "Dashboard", href: "/dashboard" },
      { title: "Reporting", href: "/reports" },
    ],
    "/settings/profile": [
      { title: "Dashboard", href: "/dashboard" },
      { title: "Settings", href: "/settings/profile" },
      { title: "Profile", href: "/settings/profile" },
    ],
    "/settings/appearance": [
      { title: "Dashboard", href: "/dashboard" },
      { title: "Settings", href: "/settings/appearance" },
      { title: "Appearance", href: "/settings/appearance" },
    ],
  }

  const breadcrumbs = breadcrumbsMap[pathname] ?? []

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <AppSidebar user={currentUser} />

        {/* Right column */}
        <div className="flex-1 min-w-0 flex flex-col bg-muted/40">
          {/* Top bar uses the same container width as the page */}
          <AppSidebarHeader breadcrumbs={breadcrumbs} />

          {/* Page content area */}
          <main className="flex-1">
            <div
              className={`${APP_CONTAINER} py-6 flex flex-col`}
              style={{ minHeight: `calc(100vh - ${APP_HEADER_HEIGHT}px)` }}
            >
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
