import { cn } from "@/lib/utils"
import AppLogoIcon from "./app-logo-icon"

export default function AppLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 text-sidebar-foreground", className)}>
      <AppLogoIcon className="h-6 w-6" />
      {/* Hide the text when the sidebar is collapsed to icon mode */}
      <span className="text-sm font-semibold tracking-tight group-data-[collapsible=icon]/sidebar:hidden">
        TSP Platform
      </span>
    </div>
  )
}
