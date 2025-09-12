import { Link } from "react-router-dom"
import type { PropsWithChildren } from "react"

type Props = {
  title?: string
  description?: string
}

export default function AuthLayout({
  children,
  title = "Log in to your account",
  description = "Enter your email and password below to log in",
}: PropsWithChildren<Props>) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-center gap-4">
            <Link to="/dashboard" className="flex flex-col items-center gap-2 font-medium">
              <span className="sr-only">{title}</span>
            </Link>

            <div className="space-y-2 text-center">
              <h1 className="text-xl font-medium">{title}</h1>
              {description && <p className="text-center text-sm text-muted-foreground">{description}</p>}
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
