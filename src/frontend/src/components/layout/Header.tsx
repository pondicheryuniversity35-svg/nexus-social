import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, ChevronDown, LogOut, Settings, User } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function Header() {
  const { currentUser, logout, setActiveTab } = useApp();

  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4 z-50 flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg nexus-accent-bg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">N</span>
        </div>
        <div className="hidden sm:block">
          <span className="font-bold text-sm tracking-widest text-foreground">
            NEXUS
          </span>
          <span className="hidden lg:inline text-muted-foreground text-xs ml-2">
            · All Your Connections, One Platform
          </span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground"
          data-ocid="header.notification.button"
        >
          <Bell className="w-5 h-5" />
          <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-[10px] nexus-accent-bg border-0 text-white">
            3
          </Badge>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-accent transition-colors"
              data-ocid="header.profile.button"
            >
              <Avatar className="w-7 h-7">
                <AvatarImage
                  src={currentUser.avatar}
                  alt={currentUser.displayName}
                />
                <AvatarFallback className="text-xs bg-muted">
                  {currentUser.displayName[0]}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:block text-sm font-medium max-w-24 truncate">
                {currentUser.displayName}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 bg-popover border-border"
          >
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setActiveTab("profile")}
              data-ocid="header.profile.link"
            >
              <User className="w-4 h-4 mr-2" /> View Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setActiveTab("settings")}
              data-ocid="header.settings.link"
            >
              <Settings className="w-4 h-4 mr-2" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={logout}
              data-ocid="header.logout.button"
            >
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
