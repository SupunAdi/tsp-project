// import { Routes, Route, Navigate } from "react-router-dom"
// import ShellWithSidebar from "@/Layouts/ShellWithSidebar"
// import TokenBinManagementLayout from "@/pages/TokenBinManagement"
// import CardBinManagement from "@/pages/TokenBinManagement/CardBinManagement"
// import AccountBinManagement from "@/pages/TokenBinManagement/AccountBinManagement"
// // import ShellWithSidebar from "./Layouts/ShellWithSidebar"
// //import ShellHeaderOnly from "@/Layouts/ShellHeaderOnly" 
// import { Dashboard, TokenBills, Profile, Instances, Tokens, Reports } from "@/pages"

// export default function App() {
//   return (
//     <Routes>
//       {/* All routes that use the sidebar + header */}
//       <Route element={<ShellWithSidebar />}>
//         <Route index element={<Navigate to="/dashboard" replace />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/token-bills" element={<TokenBills />} />
//         <Route path="/profile" element={<Profile />} />
//         <Route path="/instances" element={<Instances />} />
//         <Route path="/tokens" element={<Tokens />} />
//         <Route path="/reports" element={<Reports />} />
//       </Route>

     
//       {/* <Route element={<ShellHeaderOnly />}>
//         <Route path="/login" element={<Login />} />
//       </Route> */}
//     </Routes>
//   )
// }

// App.tsx
import { Routes, Route, Navigate } from "react-router-dom"
import ShellWithSidebar from "@/Layouts/ShellWithSidebar"
import TokenBinManagementLayout from "@/pages/TokenBinManagement"
import CardBinManagement from "@/pages/TokenBinManagement/CardBinManagement"
import AccountBinManagement from "@/pages/TokenBinManagement/AccountBinManagement"
import { Dashboard, Instances, Profile, Reports, Tokens } from "./pages"
// ... your other imports

export default function App() {
  return (
    <Routes>
      <Route element={<ShellWithSidebar />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Token Bill Management with tabs */}
        <Route path="/token-bills" element={<Navigate to="/token-bills/card-bins" replace />} />
        <Route path="/token-bills/*" element={<TokenBinManagementLayout />}>
          <Route index element={<Navigate to="card-bins" replace />} />
          <Route path="card-bins" element={<CardBinManagement />} />
          <Route path="account-bins" element={<AccountBinManagement />} />
        </Route>

        {/* other routes */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/instances" element={<Instances />} />
        <Route path="/tokens" element={<Tokens />} />
        <Route path="/reports" element={<Reports />} />
      </Route>
    </Routes>
  )
}
