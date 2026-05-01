import { cn } from "@/lib/utils";
import {
  Compass,
  Home,
  MessageSquare,
  Server,
  Settings,
  User,
} from "lucide-react";
import { type Tab, useApp } from "../../context/AppContext";

const navItems: { tab: Tab; icon: React.ElementType; label: string }[] = [
  { tab: "feed", icon: Home, label: "Feed" },
  { tab: "messages", icon: MessageSquare, label: "Messages" },
  { tab: "servers", icon: Server, label: "Servers" },
  { tab: "explore", icon: Compass, label: "Explore" },
  { tab: "profile", icon: User, label: "Profile" },
  { tab: "settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const { activeTab, setActiveTab } = useApp();

  return (
    <aside className="hidden md:flex flex-col w-16 lg:w-56 bg-sidebar border-r border-border flex-shrink-0 py-4 gap-1">
      {navItems.map(({ tab, icon: Icon, label }) => (
        <button
          type="button"
          key={tab}
          onClick={() => setActiveTab(tab)}
          data-ocid={`sidebar.${tab}.link`}
          className={cn(
            "flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left",
            activeTab === tab
              ? "bg-primary/15 text-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-accent",
          )}
        >
          <Icon className="w-5 h-5 flex-shrink-0" />
          <span className="hidden lg:block">{label}</span>
        </button>
      ))}
    </aside>
  );
}
