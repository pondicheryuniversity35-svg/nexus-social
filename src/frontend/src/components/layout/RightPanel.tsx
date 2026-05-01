import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useApp } from "../../context/AppContext";

export default function RightPanel() {
  const { conversations, servers, setActiveTab, currentUser } = useApp();

  return (
    <aside className="hidden xl:flex flex-col w-72 bg-card border-l border-border flex-shrink-0">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Recent Messages
            </h3>
            <div className="space-y-1">
              {conversations.length === 0 ? (
                <p className="text-xs text-muted-foreground px-2">
                  No conversations yet
                </p>
              ) : (
                conversations.map((conv) => {
                  const otherId = conv.participants.find(
                    (p) => p !== currentUser.id,
                  );
                  const otherName = otherId
                    ? (conv.participantNames[otherId] ?? "User")
                    : (conv.name ?? "Group");
                  const otherAvatar = otherId
                    ? conv.participantAvatars[otherId]
                    : undefined;
                  return (
                    <button
                      type="button"
                      key={conv.id}
                      onClick={() => setActiveTab("messages")}
                      className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-accent transition-colors text-left"
                      data-ocid="right_panel.message.button"
                    >
                      <div className="relative flex-shrink-0">
                        <Avatar className="w-9 h-9">
                          <AvatarImage
                            src={conv.isGroup ? undefined : otherAvatar}
                          />
                          <AvatarFallback className="bg-muted text-xs">
                            {otherName[0]}
                          </AvatarFallback>
                        </Avatar>
                        {conv.unreadCount > 0 && (
                          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium truncate">
                            {conv.isGroup ? conv.name : otherName}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {conv.lastMessage || "No messages"}
                        </p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <Badge className="ml-auto flex-shrink-0 nexus-accent-bg text-white border-0 text-[10px] h-4 min-w-4 px-1">
                          {conv.unreadCount}
                        </Badge>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Community Servers
            </h3>
            <div className="space-y-1">
              {servers.slice(0, 5).map((server) => (
                <button
                  type="button"
                  key={server.id}
                  onClick={() => setActiveTab("servers")}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-accent transition-colors text-left"
                  data-ocid="right_panel.server.button"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: `${server.bannerColor}33` }}
                  >
                    {server.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {server.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {server.channels.length} channels
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
