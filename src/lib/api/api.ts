import axios from "axios"
import { logout } from "@/lib/auth"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 
    Accept: "application/json" ,
    "Content-Type": "application/json",
  },
})

// Attach JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

//  Handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      logout()
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export default api
