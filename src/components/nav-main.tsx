import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
 
} from "@/components/ui/sidebar";
import type { NavItem } from "@/types";
import { NavLink, useLocation } from "react-router-dom";

export function NavMain({ items = [] }: { items: NavItem[] }) {
  const location = useLocation();

  return (
    <SidebarGroup className="px-2 py-0">
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive =
            item.isActive ??
            (item.href === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.href));

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={isActive} tooltip={{ children: item.title }}>
                <NavLink to={item.href}>
                  {item.icon ? <item.icon /> : null}
                  <span>{item.title}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
