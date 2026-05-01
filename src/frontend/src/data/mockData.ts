export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  isPrivate: boolean;
  followers: number;
  following: number;
  postCount: number;
  isFollowing?: boolean;
  coverImage?: string;
  gender?: "he" | "she" | "binary";
}

export interface Story {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  image: string;
  timestamp: string;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  text: string;
  timestamp: string;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  image?: string;
  videoUrl?: string;
  mediaType: "text" | "image" | "video";
  caption: string;
  likes: string[];
  comments: Comment[];
  timestamp: string;
  hashtags: string[];
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  read: boolean;
  mediaUrl?: string;
}

export interface Conversation {
  id: string;
  name?: string;
  participants: string[];
  participantNames: Record<string, string>;
  participantAvatars: Record<string, string>;
  messages: Message[];
  isGroup: boolean;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  groupAvatar?: string;
}

export interface Channel {
  id: string;
  name: string;
  type: "text" | "announcement";
  messages: Message[];
}

export interface ServerMember {
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  role: "owner" | "admin" | "member";
}

export interface Server {
  id: string;
  name: string;
  icon: string;
  description: string;
  channels: Channel[];
  members: ServerMember[];
  inviteLink: string;
  bannerColor: string;
  isCommunity?: boolean;
}

export const communityServers: Server[] = [
  {
    id: "community-general",
    name: "General",
    icon: "💬",
    description:
      "A place for everyone. Chat, discuss, and connect with the Nexus community.",
    bannerColor: "#6366f1",
    inviteLink: "",
    isCommunity: true,
    members: [],
    channels: [
      {
        id: "general-welcome",
        name: "welcome",
        type: "announcement",
        messages: [
          {
            id: "w1",
            senderId: "system",
            senderName: "Nexus",
            text: "👋 Welcome to Nexus Social! This is the General community server. Introduce yourself and say hi!",
            timestamp: new Date().toISOString(),
            read: true,
          },
        ],
      },
      { id: "general-chat", name: "general-chat", type: "text", messages: [] },
    ],
  },
  {
    id: "community-gaming",
    name: "Gaming",
    icon: "🎮",
    description:
      "For gamers of all kinds. Strategy, FPS, RPG, indie — all welcome.",
    bannerColor: "#22A7FF",
    inviteLink: "",
    isCommunity: true,
    members: [],
    channels: [
      {
        id: "gaming-welcome",
        name: "welcome",
        type: "announcement",
        messages: [
          {
            id: "gw1",
            senderId: "system",
            senderName: "Nexus",
            text: "🎮 Welcome to the Gaming server! Share your gaming moments, find teammates, and chat about your favorite games.",
            timestamp: new Date().toISOString(),
            read: true,
          },
        ],
      },
      { id: "gaming-general", name: "general", type: "text", messages: [] },
      {
        id: "gaming-lfg",
        name: "looking-for-group",
        type: "text",
        messages: [],
      },
    ],
  },
  {
    id: "community-music",
    name: "Music",
    icon: "🎵",
    description:
      "Producers, musicians, fans. Share tracks, discover artists, talk music.",
    bannerColor: "#8B5CF6",
    inviteLink: "",
    isCommunity: true,
    members: [],
    channels: [
      {
        id: "music-welcome",
        name: "welcome",
        type: "announcement",
        messages: [
          {
            id: "mw1",
            senderId: "system",
            senderName: "Nexus",
            text: "🎵 Welcome to the Music server! Share your tracks, discover new artists, and connect with fellow music lovers.",
            timestamp: new Date().toISOString(),
            read: true,
          },
        ],
      },
      { id: "music-general", name: "general", type: "text", messages: [] },
      {
        id: "music-share",
        name: "share-your-music",
        type: "text",
        messages: [],
      },
    ],
  },
  {
    id: "community-tech",
    name: "Tech",
    icon: "💻",
    description:
      "Developers, designers, engineers. Talk code, tools, and the future of tech.",
    bannerColor: "#10B981",
    inviteLink: "",
    isCommunity: true,
    members: [],
    channels: [
      {
        id: "tech-welcome",
        name: "welcome",
        type: "announcement",
        messages: [
          {
            id: "tw1",
            senderId: "system",
            senderName: "Nexus",
            text: "💻 Welcome to the Tech server! Discuss programming, tools, projects, and all things tech. No gatekeeping — all skill levels welcome.",
            timestamp: new Date().toISOString(),
            read: true,
          },
        ],
      },
      { id: "tech-general", name: "general", type: "text", messages: [] },
      {
        id: "tech-projects",
        name: "show-your-projects",
        type: "text",
        messages: [],
      },
    ],
  },
  {
    id: "community-sports",
    name: "Sports",
    icon: "⚽",
    description:
      "All sports, all fans. Follow the game with people who get it.",
    bannerColor: "#F59E0B",
    inviteLink: "",
    isCommunity: true,
    members: [],
    channels: [
      {
        id: "sports-welcome",
        name: "welcome",
        type: "announcement",
        messages: [
          {
            id: "sw1",
            senderId: "system",
            senderName: "Nexus",
            text: "⚽ Welcome to the Sports server! Football, basketball, tennis, esports — if it's competitive, it belongs here. Share scores, highlights, and hot takes!",
            timestamp: new Date().toISOString(),
            read: true,
          },
        ],
      },
      { id: "sports-general", name: "general", type: "text", messages: [] },
      {
        id: "sports-scores",
        name: "scores-and-highlights",
        type: "text",
        messages: [],
      },
    ],
  },
];

export const storyRingClasses = [
  "story-ring-cyan",
  "story-ring-purple",
  "story-ring-pink",
  "story-ring-orange",
  "story-ring-green",
  "story-ring-multi",
];
