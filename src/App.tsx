// // // import { useState } from 'react'
// // // import reactLogo from './assets/react.svg'
// // // import viteLogo from '/vite.svg'
// // // import './App.css'

// // // function App() {
// // //   const [count, setCount] = useState(0)

// // //   return (
// // //     <>
     
// // //       <h1>Vite + React</h1>
// // //       <div className="card">
// // //         <button onClick={() => setCount((count) => count + 1)}>
// // //           count is {count}
// // //         </button>
// // //         <p>
// // //           Edit <code>src/App.tsx</code> and save to test HMR
// // //         </p>
// // //       </div>
// // //       <p className="read-the-docs">
// // //         Click on the Vite and React logos to learn more
// // //       </p>
// // //     </>
// // //   )
// // // }

// // // export default App



// // import { Routes, Route, Navigate } from "react-router-dom";
// // import { SidebarProvider } from "@/components/ui/sidebar";
// // import { AppSidebar } from "@/components/app-sidebar";
// // import type { User as AppUser } from "@/types";
// // import { AppHeader } from "./components/app-header";

// // //  Dummy user just for testing the sidebar (adjust to your type)
// // const currentUser: AppUser = {
// //   id: 1,
// //   name: "Demo User",
// //   email: "demo@example.com",
// //   created_at: new Date().toISOString(),
// //   updated_at: new Date().toISOString(),
// // };

// // function DashboardPage() {
// //   return (
// //     <div className="p-6">
// //       <h1 className="text-2xl font-semibold">Dashboard</h1>
// //       <p className="text-muted-foreground mt-2">
// //         This is a demo page to test the sidebar navigation.
// //       </p>
// //     </div>
// //   );
// // }

// // function UsersPage() {
// //   return (
// //     <div className="p-6">
// //       <h1 className="text-2xl font-semibold">Users</h1>
// //       <p className="text-muted-foreground mt-2">
// //         Another demo page. Click the nav items to see active state.
// //       </p>
// //     </div>
// //   );
// // }

// // export default function App() {
// //   return (
// //     <SidebarProvider /* defaultOpen */>
// //       <div className="flex min-h-screen">
// //         {/* Left: Sidebar */}
// //         <AppSidebar user={currentUser} />

// //         {/* Right: Page content */}
// //         <main className="flex-1">
// //           <Routes>
// //             <Route path="/" element={<Navigate to="/dashboard" replace />} />
// //             <Route path="/dashboard" element={<DashboardPage />} />
// //             <Route path="/users" element={<UsersPage />} />
// //           </Routes>
// //         </main>
// //       </div>
// //     </SidebarProvider>
// //   );
// // }


// // src/App.tsx
// import { Routes, Route, Navigate, useLocation } from "react-router-dom"
// import { SidebarProvider } from "@/components/ui/sidebar"
// import { AppSidebar } from "@/components/app-sidebar"
// import { AppHeader } from "@/components/app-header"
// import type { User as AppUser, BreadcrumbItem } from "@/types"

// // Dummy user just for testing the sidebar (adjust to your type)
// const currentUser: AppUser = {
//   id: 1,
//   name: "Demo User",
//   email: "demo@example.com",
//   created_at: new Date().toISOString(),
//   updated_at: new Date().toISOString(),
// }

// function DashboardPage() {
//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-semibold">Dashboard</h1>
//       <p className="text-muted-foreground mt-2">
//         This is a demo page to test the sidebar navigation.
//       </p>
//     </div>
//   )
// }

// function UsersPage() {
//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-semibold">Users</h1>
//       <p className="text-muted-foreground mt-2">
//         Another demo page. Click the nav items to see active state.
//       </p>
//     </div>
//   )
// }

// export default function App() {
//   // Build simple breadcrumbs per route
//   const { pathname } = useLocation()

//   const breadcrumbsMap: Record<string, BreadcrumbItem[]> = {
//   "/dashboard": [{ title: "Dashboard", href: "/dashboard" }],
//   "/users": [
//     { title: "Dashboard", href: "/dashboard" },
//     { title: "Users", href: "/users" },   
//   ],
// }

// const breadcrumbs = breadcrumbsMap[pathname] ?? []

//   return (
//     <SidebarProvider>
//       <div className="flex min-h-screen">
//         {/* Left: Sidebar */}
//         <AppSidebar user={currentUser} />

//         {/* Right: Header + Page content */}
//         <div className="flex-1 flex flex-col">
//           <AppHeader breadcrumbs={breadcrumbs} />
//           <main className="flex-1">
//             <Routes>
//               <Route path="/" element={<Navigate to="/dashboard" replace />} />
//               <Route path="/dashboard" element={<DashboardPage />} />
//               <Route path="/users" element={<UsersPage />} />
//             </Routes>
//           </main>
//         </div>
//       </div>
//     </SidebarProvider>
//   )
// }


import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { Dashboard, TokenBills, Profile, Instances, Tokens, Reports } from "@/pages";
import type { BreadcrumbItem, User as AppUser } from "@/types";

const currentUser: AppUser = {
  id: 1, name: "Demo User", email: "demo@example.com",
  created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
};

export default function App() {
  const { pathname } = useLocation();

  const breadcrumbsMap: Record<string, BreadcrumbItem[]> = {
    "/dashboard": [{ title: "Dashboard", href: "/dashboard" }],
    "/token-bills": [{ title: "Dashboard", href: "/dashboard" }, { title: "Token Bill Management", href: "/token-bills" }],
    "/profile": [{ title: "Dashboard", href: "/dashboard" }, { title: "Profile Management", href: "/profile" }],
    "/instances": [{ title: "Dashboard", href: "/dashboard" }, { title: "Instance Management", href: "/instances" }],
    "/tokens": [{ title: "Dashboard", href: "/dashboard" }, { title: "Token Management", href: "/tokens" }],
    "/reports": [{ title: "Dashboard", href: "/dashboard" }, { title: "Reporting", href: "/reports" }],
  };
  const breadcrumbs = breadcrumbsMap[pathname] ?? [];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar user={currentUser} />
        <div className="flex-1 flex flex-col">
          <AppHeader breadcrumbs={breadcrumbs} />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/token-bills" element={<TokenBills />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/instances" element={<Instances />} />
              <Route path="/tokens" element={<Tokens />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
