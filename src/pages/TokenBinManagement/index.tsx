import { NavLink, Outlet } from "react-router-dom"
import { cn } from "@/lib/utils"

export default function TokenBinManagementLayout() {
  const tabs = [
    { to: "/token-bills/card-bins", label: "Card BINs" },
    { to: "/token-bills/account-bins", label: "Account BINs" },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Token BIN Management</h1>
      </div>

      {/* Tabs header */}
      <div className="border-b">
        <nav className="-mb-px flex gap-4">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end
              className={({ isActive }) =>
                cn(
                  "px-3 py-2 text-sm font-medium rounded-t-md border-b-2",
                  isActive
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )
              }
            >
              {t.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <Outlet />
    </div>
  )
}
