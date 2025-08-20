import type { LucideIcon } from "lucide-react";

export interface BreadcrumbItem {
  title: string;
  href: string; // use your router's path
}

export interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
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



// interface SVGAttributes<T> extends AriaAttributes, DOMAttributes<T> {
//         // React-specific Attributes
//         suppressHydrationWarning?: boolean | undefined;

//         // Attributes which also defined in HTMLAttributes
//         // See comment in SVGDOMPropertyConfig.js
//         className?: string | undefined;
//         color?: string | undefined;
//         height?: number | string | undefined;
//         id?: string | undefined;
//         lang?: string | undefined;
//         max?: number | string | undefined;
//         media?: string | undefined;
//         method?: string | undefined;
//         min?: number | string | undefined;
//         name?: string | undefined;
//         style?: CSSProperties | undefined;
//         target?: string | undefined;
//         type?: string | undefined;
//         width?: number | string | undefined;
