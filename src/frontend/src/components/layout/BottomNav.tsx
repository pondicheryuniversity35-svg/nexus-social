import { cn } from "@/lib/utils";
import { Compass, Home, MessageSquare, Server, User } from "lucide-react";
import { type Tab, useApp } from "../../context/AppContext";

const items: { tab: Tab; icon: React.ElementType; label: string }[] = [
  { tab: "feed", icon: Home, label: "Feed" },
  { tab: "messages", icon: MessageSquare, label: "Messages" },
  { tab: "servers", icon: Server, label: "Servers" },
  { tab: "explore", icon: Compass, label: "Explore" },
  { tab: "profile", icon: User, label: "Profile" },
];

export default function BottomNav() {
  const { activeTab, setActiveTab } = useApp();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
      <div className="flex items-center justify-around h-16 px-2">
        {items.map(({ tab, icon: Icon, label }) => (
          <button
            type="button"
            key={tab}
            onClick={() => setActiveTab(tab)}
            data-ocid={`bottom_nav.${tab}.link`}
            className={cn(
              "flex flex-col items-center gap-0.5 flex-1 py-2 px-1 rounded-xl transition-colors",
              activeTab === tab ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
