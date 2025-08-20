// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
     
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App


// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import type { User as AppUser } from "@/types";

// 👤 Dummy user just for testing the sidebar (adjust to your type)
const currentUser: AppUser = {
  id: 1,
  name: "Demo User",
  email: "demo@example.com",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-muted-foreground mt-2">
        This is a demo page to test the sidebar navigation.
      </p>
    </div>
  );
}

function UsersPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Users</h1>
      <p className="text-muted-foreground mt-2">
        Another demo page. Click the nav items to see active state.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <SidebarProvider /* defaultOpen */>
      <div className="flex min-h-screen">
        {/* Left: Sidebar */}
        <AppSidebar user={currentUser} />

        {/* Right: Page content */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/users" element={<UsersPage />} />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
}
