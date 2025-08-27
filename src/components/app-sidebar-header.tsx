import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { APP_CONTAINER, APP_HEADER_HEIGHT } from "@/lib/layout";

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    return (
        <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur"
          style={{ height: APP_HEADER_HEIGHT }}
        >
            <div className={`${APP_CONTAINER} h-full flex items-center gap-2`}>
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
        </header>
    );
}
