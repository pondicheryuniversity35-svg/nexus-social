import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Hash, Plus, Send, Volume2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";
import type { Message, Server } from "../data/mockData";

function timeAgo(ts: string): string {
  try {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  } catch {
    return ts;
  }
}

export default function ServersPage() {
  const { servers, setServers, currentUser } = useApp();
  const [selectedServerId, setSelectedServerId] = useState(
    servers[0]?.id ?? null,
  );
  const [selectedChannelId, setSelectedChannelId] = useState(
    servers[0]?.channels[0]?.id ?? null,
  );
  const [messageText, setMessageText] = useState("");
  const [newServerName, setNewServerName] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const selectedServer = servers.find((s) => s.id === selectedServerId) ?? null;
  const selectedChannel =
    selectedServer?.channels.find((ch) => ch.id === selectedChannelId) ?? null;

  const handleSelectServer = (server: Server) => {
    setSelectedServerId(server.id);
    setSelectedChannelId(server.channels[0]?.id ?? null);
  };

  const handleSend = () => {
    if (!messageText.trim() || !selectedServerId || !selectedChannelId) return;
    const newMsg: Message = {
      id: `smsg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.displayName,
      text: messageText.trim(),
      timestamp: new Date().toISOString(),
      read: true,
    };
    setServers(
      servers.map((s) =>
        s.id === selectedServerId
          ? {
              ...s,
              channels: s.channels.map((ch) =>
                ch.id === selectedChannelId
                  ? { ...ch, messages: [...ch.messages, newMsg] }
                  : ch,
              ),
            }
          : s,
      ),
    );
    setMessageText("");
  };

  const handleCreateServer = () => {
    if (!newServerName.trim()) return;
    const newServer: Server = {
      id: `sv_${Date.now()}`,
      name: newServerName.trim(),
      icon: "🌟",
      description: "A new community server",
      bannerColor: "#22A7FF",
      inviteLink: "",
      members: [
        {
          userId: currentUser.id,
          username: currentUser.username,
          displayName: currentUser.displayName,
          avatar: currentUser.avatar,
          role: "owner",
        },
      ],
      channels: [
        { id: `ch_${Date.now()}`, name: "general", type: "text", messages: [] },
        {
          id: `ch_${Date.now() + 1}`,
          name: "welcome",
          type: "announcement",
          messages: [
            {
              id: `w_${Date.now()}`,
              senderId: "system",
              senderName: "Nexus",
              text: `🎉 Welcome to ${newServerName}!`,
              timestamp: new Date().toISOString(),
              read: true,
            },
          ],
        },
      ],
    };
    setServers([...servers, newServer]);
    setNewServerName("");
    setCreateOpen(false);
    handleSelectServer(newServer);
    toast.success(`Server "${newServer.name}" created!`);
  };

  return (
    <div className="flex h-full" style={{ height: "calc(100vh - 56px)" }}>
      {/* Server List */}
      <div className="w-16 border-r border-border flex flex-col items-center py-3 gap-2 flex-shrink-0">
        {servers.map((server) => (
          <button
            type="button"
            key={server.id}
            title={server.name}
            onClick={() => handleSelectServer(server)}
            className={cn(
              "w-12 h-12 rounded-2xl text-xl flex items-center justify-center transition-all",
              selectedServerId === server.id
                ? "rounded-xl scale-105"
                : "opacity-70 hover:opacity-100 hover:rounded-xl",
            )}
            style={{
              background:
                selectedServerId === server.id
                  ? `${server.bannerColor}33`
                  : "oklch(0.18 0.014 245)",
              outline:
                selectedServerId === server.id
                  ? `2px solid ${server.bannerColor}`
                  : "none",
              outlineOffset: "2px",
            }}
            data-ocid="servers.server.button"
          >
            {server.icon}
          </button>
        ))}
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              className="w-12 h-12 rounded-2xl bg-muted text-muted-foreground hover:text-foreground hover:bg-accent flex items-center justify-center transition-all"
              data-ocid="servers.create_server.open_modal_button"
            >
              <Plus className="w-5 h-5" />
            </button>
          </DialogTrigger>
          <DialogContent
            className="bg-card border-border"
            data-ocid="servers.create_server.dialog"
          >
            <DialogHeader>
              <DialogTitle>Create a Server</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="create-server-name">Server Name</Label>
                <Input
                  id="create-server-name"
                  placeholder="My Awesome Server"
                  value={newServerName}
                  onChange={(e) => setNewServerName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateServer()}
                  className="bg-muted border-border"
                  data-ocid="servers.create_server.input"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCreateOpen(false)}
                  data-ocid="servers.create_server.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  className="nexus-accent-bg text-white"
                  onClick={handleCreateServer}
                  data-ocid="servers.create_server.confirm_button"
                >
                  Create Server
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Channel List */}
      {selectedServer && (
        <div className="w-52 border-r border-border flex flex-col flex-shrink-0">
          <div
            className="h-12 flex items-center px-3 border-b border-border"
            style={{ background: `${selectedServer.bannerColor}22` }}
          >
            <span className="font-semibold text-sm truncate">
              {selectedServer.name}
            </span>
          </div>
          <ScrollArea className="flex-1 py-2">
            <div className="px-2 space-y-0.5">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1">
                Channels
              </p>
              {selectedServer.channels.map((ch) => (
                <button
                  type="button"
                  key={ch.id}
                  onClick={() => setSelectedChannelId(ch.id)}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors text-left",
                    selectedChannelId === ch.id
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                  )}
                  data-ocid="servers.channel.button"
                >
                  {ch.type === "announcement" ? (
                    <Volume2 className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <Hash className="w-4 h-4 flex-shrink-0" />
                  )}
                  {ch.name}
                </button>
              ))}
            </div>
            {selectedServer.members.length > 0 && (
              <div className="px-2 mt-4">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1">
                  Members
                </p>
                {selectedServer.members.map((m) => (
                  <div
                    key={m.userId}
                    className="flex items-center gap-2 px-2 py-1.5"
                  >
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={m.avatar} />
                      <AvatarFallback className="bg-muted text-[10px]">
                        {m.displayName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground truncate flex-1">
                      {m.username}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      )}

      {/* Channel Chat */}
      <div className="flex-1 flex flex-col">
        {selectedChannel ? (
          <>
            <div className="h-12 flex items-center gap-2 px-4 border-b border-border">
              <Hash className="w-5 h-5 text-muted-foreground" />
              <span className="font-semibold">{selectedChannel.name}</span>
              {selectedServer && (
                <span className="text-xs text-muted-foreground ml-2 hidden sm:block">
                  {selectedServer.description}
                </span>
              )}
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {selectedChannel.messages.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    No messages yet. Start the conversation!
                  </p>
                ) : (
                  selectedChannel.messages.map((msg) => (
                    <div key={msg.id} className="flex gap-3">
                      <Avatar className="w-9 h-9 flex-shrink-0 mt-0.5">
                        <AvatarFallback className="bg-muted text-xs">
                          {msg.senderName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-semibold">
                            {msg.senderName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {timeAgo(msg.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-foreground/90 mt-0.5">
                          {msg.text}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
            {selectedChannel.type !== "announcement" && (
              <div className="p-4 border-t border-border flex gap-2">
                <Input
                  placeholder={`Message #${selectedChannel.name}`}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="bg-muted border-border flex-1"
                  data-ocid="servers.channel.input"
                />
                <Button
                  size="icon"
                  className="nexus-accent-bg text-white"
                  onClick={handleSend}
                  data-ocid="servers.channel.send.button"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div
            className="flex-1 flex items-center justify-center text-muted-foreground"
            data-ocid="servers.empty_state"
          >
            <div className="text-center">
              <p className="text-lg font-medium">Select a channel</p>
              <p className="text-sm mt-1">Choose a channel to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
