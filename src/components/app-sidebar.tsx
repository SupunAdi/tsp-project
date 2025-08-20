import { NavFooter } from "@/components/nav-footer";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { NavItem, User as AppUser } from "@/types";
import { Link } from "react-router-dom";
import { BookOpen, Folder, LayoutGrid, User as UserIcon,ReceiptText,UserCog,Server,Coins,BarChart3,
   } from "lucide-react";
// import AppLogo from "./app-logo";

const mainNavItems: NavItem[] = [
  // { title: "Users", href: "/users", icon: UserIcon },
    { title: "Dashboard",            href: "/dashboard",   icon: LayoutGrid },
  { title: "Token Bill Management",href: "/token-bills", icon: ReceiptText },
  { title: "Profile Management",   href: "/profile",     icon: UserCog },
  { title: "Instance Management",  href: "/instances",   icon: Server },
  { title: "Token Management",     href: "/tokens",      icon: Coins },
  { title: "Reporting",            href: "/reports",     icon: BarChart3 }
];

// const footerNavItems: NavItem[] = [
//   { title: "Repository", href: "https://github.com/laravel/react-starter-kit", icon: Folder },
//   { title: "Documentation", href: "https://laravel.com/docs/starter-kits#react", icon: BookOpen },
// ];

type AppSidebarProps = {
  user: AppUser;
};

export function AppSidebar({ user }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard">
                {/* <AppLogo /> */}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={mainNavItems} />
      </SidebarContent>

      <SidebarFooter>
        {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
