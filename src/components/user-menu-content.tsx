import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { UserInfo } from "@/components/user-info";
import { useMobileNavigation } from "@/hooks/use-mobile-navigation";
import type { User } from "@/types";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { LogOut, Settings } from "lucide-react";
import { useCallback } from "react";

interface UserMenuContentProps {
  user: User;
  onLogout?: () => Promise<void> | void;    //  logout handler (clear tokens, etc.)
  settingsPath?: string;                    // defaults to "/settings"
  afterLogoutRedirectTo?: string;           // defaults to "/login"
}

export function UserMenuContent({
  user,
  onLogout,
  settingsPath = "/settings",
  afterLogoutRedirectTo = "/login",
}: UserMenuContentProps) {
  const cleanup = useMobileNavigation();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    try {
      cleanup();
      await onLogout?.();
    } finally {
      navigate(afterLogoutRedirectTo, { replace: true });
    }
  }, [cleanup, onLogout, navigate, afterLogoutRedirectTo]);

  return (
    <>
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <UserInfo user={user} showEmail />
        </div>
      </DropdownMenuLabel>

      <DropdownMenuSeparator />

      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <RouterLink className="block w-full" to={settingsPath} onClick={cleanup}>
            <Settings className="mr-2" />
            Settings
          </RouterLink>
        </DropdownMenuItem>
      </DropdownMenuGroup>

      <DropdownMenuSeparator />

      <DropdownMenuItem onClick={handleLogout}>
        <LogOut className="mr-2" />
        Log out
      </DropdownMenuItem>
    </>
  );
}
