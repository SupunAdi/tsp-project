import { cn } from "@/lib/utils"

export default function AppLogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      role="img"
      aria-label="TSP"
      className={cn("shrink-0 text-primary", className)}
    >
      {/* soft rounded backdrop */}
      <rect x="2" y="2" width="28" height="28" rx="8" fill="currentColor" fillOpacity="0.15" />
      {/* simple diamond “token” mark */}
      <path d="M16 6 26 16 16 26 6 16 16 6Z" fill="currentColor" />
      {/* little sparkle */}
      <circle cx="22.5" cy="9.5" r="2" fill="currentColor" />
    </svg>
  )
}
