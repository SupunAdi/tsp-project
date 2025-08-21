import { Routes, Route, Navigate } from "react-router-dom"
import ShellWithSidebar from "@/Layouts/ShellWithSidebar"
// import ShellWithSidebar from "./Layouts/ShellWithSidebar"
//import ShellHeaderOnly from "@/Layouts/ShellHeaderOnly" 
import { Dashboard, TokenBills, Profile, Instances, Tokens, Reports } from "@/pages"

export default function App() {
  return (
    <Routes>
      {/* All routes that use the sidebar + header */}
      <Route element={<ShellWithSidebar />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/token-bills" element={<TokenBills />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/instances" element={<Instances />} />
        <Route path="/tokens" element={<Tokens />} />
        <Route path="/reports" element={<Reports />} />
      </Route>

     
      {/* <Route element={<ShellHeaderOnly />}>
        <Route path="/login" element={<Login />} />
      </Route> */}
    </Routes>
  )
}

