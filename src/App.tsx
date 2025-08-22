import { Routes, Route, Navigate } from "react-router-dom"
import ShellWithSidebar from "@/Layouts/ShellWithSidebar"
import TokenBinManagementLayout from "@/pages/TokenBinManagement"
import CardBinManagement from "@/pages/TokenBinManagement/CardBinManagement"
import AccountBinManagement from "@/pages/TokenBinManagement/AccountBinManagement"
import { Dashboard, Instances, Profile, Reports, Tokens } from "./pages"
import Login from "@/pages/Login"


export default function App() {
  return (
    <Routes>

      <Route path="/login" element={<Login />} />
      
      <Route element={<ShellWithSidebar />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Token Bill Management with tabs */}
        {/* <Route path="/token-bills" element={<Navigate to="/token-bills/card-bins" replace />} /> */}
        <Route path="/token-bills/*" element={<TokenBinManagementLayout />}>
          <Route index element={<Navigate to="card-bins" replace />} />
          <Route path="card-bins" element={<CardBinManagement />} />
          <Route path="account-bins" element={<AccountBinManagement />} />
        </Route>

        <Route path="/profile" element={<Profile />} />
        <Route path="/instances" element={<Instances />} />
        <Route path="/tokens" element={<Tokens />} />
        <Route path="/reports" element={<Reports />} />
      </Route>
    </Routes>
  )
}


// src/App.tsx (only the relevant bits)


// export default function App() {
//   return (
//     <Routes>
//       {/* Public auth route (no sidebar/header) */}
//       

//       {/* App routes with sidebar/header */}
//       <Route element={<ShellWithSidebar />}>
//         <Route index element={<Navigate to="/dashboard" replace />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/instances" element={<Instances />} />
//         <Route path="/profile" element={<Profile />} />
//         <Route path="/tokens" element={<Tokens />} />
//         <Route path="/reports" element={<Reports />} />
//       </Route>
//     </Routes>
//   )
// }
