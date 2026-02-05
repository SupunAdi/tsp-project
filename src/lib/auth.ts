export function logout() {
  localStorage.removeItem("accessToken")
  localStorage.removeItem("tokenType")
  window.location.href = "/login"
}