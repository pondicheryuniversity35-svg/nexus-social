import { type ReactNode, createContext, useContext, useState } from "react";
import {
  type Conversation,
  type Post,
  type Server,
  type User,
  communityServers,
} from "../data/mockData";

export type Tab =
  | "feed"
  | "messages"
  | "servers"
  | "explore"
  | "profile"
  | "settings";

interface AppContextValue {
  currentUser: User;
  setCurrentUser: (u: User) => void;
  activeTab: Tab;
  setActiveTab: (t: Tab) => void;
  posts: Post[];
  setPosts: (p: Post[]) => void;
  conversations: Conversation[];
  setConversations: (c: Conversation[]) => void;
  servers: Server[];
  setServers: (s: Server[]) => void;
  blockedUsers: string[];
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  reportedContent: string[];
  reportContent: (id: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function loadLocalPosts(principalId: string): Post[] {
  try {
    const stored = localStorage.getItem(`nexus_posts_${principalId}`);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function loadLocalConversations(principalId: string): Conversation[] {
  try {
    const stored = localStorage.getItem(`nexus_conversations_${principalId}`);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function loadLocalServers(principalId: string): Server[] {
  try {
    const stored = localStorage.getItem(`nexus_servers_${principalId}`);
    return stored ? JSON.parse(stored) : communityServers;
  } catch {
    return communityServers;
  }
}

function loadBlockedUsers(principalId: string): string[] {
  try {
    const stored = localStorage.getItem(`nexus_blocked_${principalId}`);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function AppProvider({
  children,
  initialUser,
  onLogout,
}: {
  children: ReactNode;
  initialUser: User;
  onLogout: () => void;
}) {
  const [currentUser, setCurrentUserState] = useState<User>(initialUser);
  const [activeTab, setActiveTab] = useState<Tab>("feed");
  const [posts, setPostsState] = useState<Post[]>(() =>
    loadLocalPosts(initialUser.id),
  );
  const [conversations, setConversationsState] = useState<Conversation[]>(() =>
    loadLocalConversations(initialUser.id),
  );
  const [servers, setServersState] = useState<Server[]>(() =>
    loadLocalServers(initialUser.id),
  );
  const [blockedUsers, setBlockedUsers] = useState<string[]>(() =>
    loadBlockedUsers(initialUser.id),
  );
  const [reportedContent, setReportedContent] = useState<string[]>([]);

  const setCurrentUser = (u: User) => {
    localStorage.setItem(`nexus_profile_${u.id}`, JSON.stringify(u));
    setCurrentUserState(u);
  };

  const setPosts = (p: Post[]) => {
    localStorage.setItem(`nexus_posts_${currentUser.id}`, JSON.stringify(p));
    setPostsState(p);
  };

  const setConversations = (c: Conversation[]) => {
    localStorage.setItem(
      `nexus_conversations_${currentUser.id}`,
      JSON.stringify(c),
    );
    setConversationsState(c);
  };

  const setServers = (s: Server[]) => {
    localStorage.setItem(`nexus_servers_${currentUser.id}`, JSON.stringify(s));
    setServersState(s);
  };

  const blockUser = (userId: string) => {
    const updated = [...blockedUsers, userId];
    setBlockedUsers(updated);
    localStorage.setItem(
      `nexus_blocked_${currentUser.id}`,
      JSON.stringify(updated),
    );
  };

  const unblockUser = (userId: string) => {
    const updated = blockedUsers.filter((id) => id !== userId);
    setBlockedUsers(updated);
    localStorage.setItem(
      `nexus_blocked_${currentUser.id}`,
      JSON.stringify(updated),
    );
  };

  const reportContent = (id: string) => {
    setReportedContent((prev) => [...prev, id]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        activeTab,
        setActiveTab,
        posts,
        setPosts,
        conversations,
        setConversations,
        servers,
        setServers,
        blockedUsers,
        blockUser,
        unblockUser,
        reportedContent,
        reportContent,
        logout: onLogout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
