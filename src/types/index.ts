import type { LucideIcon } from "lucide-react";

export interface BreadcrumbItem {
  title: string;
  href: string; // use router's path
}

export interface NavItem {
  title: string;
  href: string;
  // icon?: LucideIcon | React.ComponentType<{ className?: string }>;
    icon?: LucideIcon | React.ComponentType<{ className?: string }> | null ;
  isActive?: boolean;
  children?: NavItem[] 
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  emailVerifiedAt?: string | null; // camelCase to match JS conventions
  createdAt?: string;
  updatedAt?: string;
  // Allow extra fields if you need them:
  [key: string]: unknown;
}

export interface SharedData {
  name: string;
  quote: { message: string; author: string };
  user?: User;            // no "auth", just a plain user (or undefined if logged out)
  sidebarOpen: boolean;
  [key: string]: unknown; // extensible
}



