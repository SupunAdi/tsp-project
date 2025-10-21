import { Routes, Route, Navigate } from "react-router-dom"
import ShellWithSidebar from "@/Layouts/ShellWithSidebar"

import TokenBinManagementLayout from "@/pages/TokenBinManagement"
import CardBinManagement from "./pages/TokenBinManagement/CardBinManagement/CardBinManagement"
import AccountBinManagement from "@/pages/TokenBinManagement/AccountBinManagement/AccountBinManagement"

import { Dashboard, Instances ,Profile ,Reports , Tokens } from "./pages"

import Login from "@/pages/Login"

// Settings
import SettingsProfile from "@/pages/settings/profile"
import Password from "@/pages/settings/password"
import Appearance from "@/pages/settings/appearance"

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ShellWithSidebar />}>
      
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Token Bin Management with tabs */}
        <Route path="/token-bins/*" element={<TokenBinManagementLayout />}>
          <Route index element={<Navigate to="card-bins" replace />} />
          <Route path="card-bins" element={<CardBinManagement />} />
          <Route path="account-bins" element={<AccountBinManagement />} />
        </Route>

        <Route path="/profile" element={<Profile />} />
        <Route path="/instances" element={<Instances />} />
        <Route path="/tokens" element={<Tokens />} />
        <Route path="/reports" element={<Reports />} />

        {/* Settings */}
        <Route path="/settings" element={<Navigate to="/settings/profile" replace />} />
        <Route path="/settings/profile" element={<SettingsProfile />} />
        <Route path="/settings/password" element={<Password />} />
        <Route path="/settings/appearance" element={<Appearance />} />
      </Route>
    </Routes>
  )
}

//i think the login is connect when use browse route