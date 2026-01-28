import { Navigate, Outlet } from "react-router-dom"
import { isTokenExpired } from "@/lib/jwt"
import { logout } from "@/lib/auth"

export default function ProtectedRoute() {
  const token = localStorage.getItem("accessToken")

  if (!token || isTokenExpired(token)) {
    logout()
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

