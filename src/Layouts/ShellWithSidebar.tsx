import { Outlet, useLocation } from "react-router-dom"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import type { BreadcrumbItem, User as AppUser } from "@/types"

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
      {/* Page background uses the global background token */}
      <div className="flex min-h-screen bg-background">
          <AppSidebar user={currentUser} />

        {/* Content column gets a subtle panel background */}
        <div className="flex-1 min-w-0 flex flex-col bg-muted/40">
           <SidebarTrigger className="m-2" />
          <AppHeader breadcrumbs={breadcrumbs} />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-0">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
