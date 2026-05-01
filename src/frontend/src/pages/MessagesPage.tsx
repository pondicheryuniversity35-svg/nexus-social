import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ArrowLeft, Plus, Send, Users } from "lucide-react";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import type { Conversation, Message } from "../data/mockData";

function timeAgo(ts: string): string {
  try {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  } catch {
    return ts;
  }
}

export default function MessagesPage() {
  const { currentUser, conversations, setConversations } = useApp();
  const [selectedId, setSelectedId] = useState<string | null>(
    conversations[0]?.id ?? null,
  );
  const [messageText, setMessageText] = useState("");
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const [newDmOpen, setNewDmOpen] = useState(false);
  const [newDmName, setNewDmName] = useState("");

  const selectedConv = conversations.find((c) => c.id === selectedId);

  const getConvDisplay = (conv: Conversation) => {
    if (conv.isGroup)
      return {
        name: conv.name ?? "Group",
        avatar: undefined,
        initials: conv.name?.[0] ?? "G",
      };
    const otherId = conv.participants.find((p) => p !== currentUser.id);
    const name = otherId ? (conv.participantNames[otherId] ?? "User") : "User";
    const avatar = otherId ? conv.participantAvatars[otherId] : undefined;
    return { name, avatar, initials: name[0] };
  };

  const handleSend = () => {
    if (!messageText.trim() || !selectedId) return;
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.displayName,
      text: messageText.trim(),
      timestamp: new Date().toISOString(),
      read: true,
    };
    setConversations(
      conversations.map((c) =>
        c.id === selectedId
          ? {
              ...c,
              messages: [...c.messages, newMsg],
              lastMessage: newMsg.text,
              lastTimestamp: newMsg.timestamp,
              unreadCount: 0,
            }
          : c,
      ),
    );
    setMessageText("");
  };

  const handleSelectConv = (id: string) => {
    setSelectedId(id);
    setConversations(
      conversations.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c)),
    );
    setMobileView("chat");
  };

  const handleNewDm = () => {
    if (!newDmName.trim()) return;
    const otherId = `user_${Date.now()}`;
    const newConv: Conversation = {
      id: `cv_${Date.now()}`,
      participants: [currentUser.id, otherId],
      participantNames: {
        [currentUser.id]: currentUser.displayName,
        [otherId]: newDmName,
      },
      participantAvatars: {
        [currentUser.id]: currentUser.avatar,
        [otherId]: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newDmName}`,
      },
      isGroup: false,
      messages: [],
      lastMessage: "",
      lastTimestamp: new Date().toISOString(),
      unreadCount: 0,
    };
    setConversations([newConv, ...conversations]);
    setSelectedId(newConv.id);
    setMobileView("chat");
    setNewDmName("");
    setNewDmOpen(false);
  };

  return (
    <div className="flex h-full" style={{ height: "calc(100vh - 56px)" }}>
      {/* Conversation List */}
      <div
        className={cn(
          "w-full md:w-80 border-r border-border flex flex-col flex-shrink-0",
          mobileView === "chat" ? "hidden md:flex" : "flex",
        )}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold">Messages</h2>
          <Button
            size="icon"
            variant="ghost"
            className="text-muted-foreground"
            onClick={() => setNewDmOpen(true)}
            data-ocid="messages.new_conversation.button"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              <p>No messages yet.</p>
              <p className="mt-1">Start a conversation!</p>
            </div>
          ) : (
            conversations.map((conv) => {
              const { name, avatar, initials } = getConvDisplay(conv);
              return (
                <button
                  type="button"
                  key={conv.id}
                  onClick={() => handleSelectConv(conv.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors text-left border-b border-border/50",
                    selectedId === conv.id && "bg-accent",
                  )}
                  data-ocid="messages.conversation.item"
                >
                  <div className="relative flex-shrink-0">
                    <Avatar className="w-11 h-11">
                      {conv.isGroup ? (
                        <AvatarFallback className="bg-muted text-sm">
                          <Users className="w-5 h-5" />
                        </AvatarFallback>
                      ) : (
                        <>
                          <AvatarImage src={avatar} />
                          <AvatarFallback className="bg-muted">
                            {initials}
                          </AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    {conv.unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold truncate">
                        {name}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1 flex-shrink-0">
                        {timeAgo(conv.lastTimestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {conv.lastMessage || "No messages yet"}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <Badge className="nexus-accent-bg text-white border-0 text-[10px] h-4 min-w-4 px-1">
                      {conv.unreadCount}
                    </Badge>
                  )}
                </button>
              );
            })
          )}
        </ScrollArea>
      </div>

      {/* Chat View */}
      <div
        className={cn(
          "flex-1 flex flex-col",
          mobileView === "list" ? "hidden md:flex" : "flex",
        )}
      >
        {selectedConv ? (
          <>
            <div className="p-4 border-b border-border flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-muted-foreground"
                onClick={() => setMobileView("list")}
                data-ocid="messages.back.button"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              {(() => {
                const { name, avatar, initials } = getConvDisplay(selectedConv);
                return (
                  <>
                    <Avatar className="w-9 h-9">
                      {selectedConv.isGroup ? (
                        <AvatarFallback className="bg-muted">
                          <Users className="w-4 h-4" />
                        </AvatarFallback>
                      ) : (
                        <>
                          <AvatarImage src={avatar} />
                          <AvatarFallback className="bg-muted">
                            {initials}
                          </AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{name}</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedConv.isGroup
                          ? `${selectedConv.participants.length} members`
                          : "Active recently"}
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {selectedConv.messages.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    No messages yet. Say hello!
                  </p>
                ) : (
                  selectedConv.messages.map((msg) => {
                    const isMe = msg.senderId === currentUser.id;
                    return (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex gap-2",
                          isMe ? "justify-end" : "justify-start",
                        )}
                      >
                        {!isMe && (
                          <Avatar className="w-7 h-7 flex-shrink-0 mt-1">
                            <AvatarImage
                              src={
                                selectedConv.participantAvatars[msg.senderId]
                              }
                            />
                            <AvatarFallback className="bg-muted text-xs">
                              {msg.senderName[0]}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={cn(
                            "max-w-xs lg:max-w-sm flex flex-col gap-1",
                            isMe ? "items-end" : "items-start",
                          )}
                        >
                          {!isMe && selectedConv.isGroup && (
                            <span className="text-xs text-muted-foreground ml-1">
                              {msg.senderName}
                            </span>
                          )}
                          <div
                            className={cn(
                              "rounded-2xl px-4 py-2.5 text-sm",
                              isMe
                                ? "nexus-accent-bg text-white rounded-tr-sm"
                                : "bg-muted text-foreground rounded-tl-sm",
                            )}
                          >
                            {msg.text}
                          </div>
                          <span className="text-[10px] text-muted-foreground px-1">
                            {timeAgo(msg.timestamp)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
            <div className="p-4 border-t border-border flex gap-2">
              <Input
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="bg-muted border-border flex-1"
                data-ocid="messages.chat.input"
              />
              <Button
                size="icon"
                className="nexus-accent-bg text-white flex-shrink-0"
                onClick={handleSend}
                data-ocid="messages.send.button"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </>
        ) : (
          <div
            className="flex-1 flex items-center justify-center text-muted-foreground"
            data-ocid="messages.empty_state"
          >
            <div className="text-center">
              <p className="text-lg font-medium">No conversation selected</p>
              <p className="text-sm mt-1">
                Start a new DM to connect with someone
              </p>
              <Button
                className="mt-4 nexus-accent-bg text-white"
                onClick={() => setNewDmOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" /> New Message
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={newDmOpen} onOpenChange={setNewDmOpen}>
        <DialogContent className="bg-card border-border sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Enter display name..."
              value={newDmName}
              onChange={(e) => setNewDmName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleNewDm()}
              className="bg-muted border-border"
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              Enter the display name of the person you want to message.
            </p>
            <Button
              className="w-full nexus-accent-bg text-white"
              onClick={handleNewDm}
              disabled={!newDmName.trim()}
            >
              Start Conversation
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
