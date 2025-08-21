import { Outlet } from "react-router-dom"
import { AppHeader } from "@/components/app-header"

export default function ShellHeaderOnly() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
