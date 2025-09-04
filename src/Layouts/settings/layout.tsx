import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { type NavItem } from "@/types";
import { Link, useLocation } from "react-router-dom";
import { type PropsWithChildren } from "react";

const sidebarNavItems: NavItem[] = [
  { title: "Profile", href: "/settings/profile", icon: null },
  { title: "Password", href: "/settings/password", icon: null },
  { title: "Appearance", href: "/settings/appearance", icon: null }
];

export default function SettingsLayout({ children }: PropsWithChildren) {
  const { pathname } = useLocation();

  return (
    <div className="px-4 py-6 ">
      <Heading title="Settings" description="Manage your profile and account settings" />
      <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-12 flex flex-col gap-6 ">
        <aside className="w-full lg:w-56">
          <nav className="flex flex-col space-y-1 ">
            {sidebarNavItems.map((item, i) => (
              <Button
                key={`${item.href}-${i}`}
                size="sm"
                variant="ghost"
                asChild
                className={cn("w-full justify-start", { "bg-muted": pathname === item.href })}
              >
                <Link to={item.href}>{item.title}</Link>
              </Button>
            ))}
          </nav>
        </aside>

        <Separator className="lg:hidden" />
        <div className="flex-1 min-w-0 w-full">
          <section className="w-full max-w-none space-y-12">{children}</section>
        </div>
      </div>
    </div>
  );
}
