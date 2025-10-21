import { useState } from "react"
import type { FormEvent } from "react"
import { useNavigate, Link } from "react-router-dom"

import AuthLayout from "@/Layouts/auth-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import InputError from "@/components/input-error"      
import { LoaderCircle } from "lucide-react"

type Errors = { email?: string; password?: string }

// super-simple demo auth (accepts any non-empty email/password)
function fakeAuth(email: string, password: string) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => (email && password ? resolve() : reject(new Error("Email and password are required"))), 500)
  })
}

export default function Login() {
  const navigate = useNavigate()
  const [processing, setProcessing] = useState(false)
  const [errors, setErrors] = useState<Errors>({})

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrors({})
    setProcessing(true)

    const fd = new FormData(e.currentTarget)
    const email = String(fd.get("email") || "")
    const password = String(fd.get("password") || "")

    try {
      await fakeAuth(email, password)
      // (optional) remember logged-in state
      localStorage.setItem("auth", "true")
      navigate("/dashboard", { replace: true })
    } catch (err: any) {
      setErrors({
        email: !email ? "Email is required" : undefined,
        password: !password ? "Password is required" : undefined,
      })
    } finally {
      setProcessing(false)
    }
  }

  return (
    <AuthLayout title="Log in to your account" description="Enter your email and password below to log in">
      <form className="flex flex-col gap-6" onSubmit={onSubmit}>
        <div className="grid gap-6">
          {/* Email */}
          <div className="grid gap-2">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" name="email" type="email" autoComplete="email" placeholder="email@example.com" required autoFocus />
            <InputError message={errors.email} />
          </div>

          {/* Password */}
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link to="/forgot-password" className="ml-auto text-sm">Forgot password?</Link>
            </div>
            <Input id="password" name="password" type="password" autoComplete="current-password" placeholder="Password" required />
            <InputError message={errors.password} />
          </div>

          <div className="flex items-center space-x-3">
            <Checkbox id="remember" name="remember" />
            <Label htmlFor="remember">Remember me</Label>
          </div>

          <Button type="submit" className="mt-2 w-full" disabled={processing}>
            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
            Log in
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="underline underline-offset-4">Sign up</Link>
        </div>
      </form>
    </AuthLayout>
  )
}
