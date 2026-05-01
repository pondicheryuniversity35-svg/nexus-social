import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
  Share2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../../context/AppContext";
import type { Post } from "../../data/mockData";

interface Props {
  post: Post;
  onLike: (id: string) => void;
  onComment: (postId: string, text: string) => void;
}

function timeAgo(timestamp: string): string {
  try {
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  } catch {
    return timestamp;
  }
}

export default function PostCard({ post, onLike, onComment }: Props) {
  const { currentUser, blockUser, reportContent } = useApp();
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [saved, setSaved] = useState(false);

  const isLiked = post.likes.includes(currentUser.id);

  const handleComment = () => {
    if (!newComment.trim()) return;
    onComment(post.id, newComment.trim());
    setNewComment("");
  };

  const handleReport = () => {
    reportContent(post.id);
    toast.success("Post reported. Thank you for keeping Nexus safe.");
  };

  const handleBlock = () => {
    blockUser(post.userId);
    toast.success(`@${post.username} has been blocked.`);
  };

  return (
    <>
      <article className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={post.avatar} />
              <AvatarFallback className="bg-muted">
                {post.displayName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{post.displayName}</p>
              <p className="text-xs text-muted-foreground">
                @{post.username} · {timeAgo(post.timestamp)}
              </p>
            </div>
          </div>
          {post.userId !== currentUser.id && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 text-muted-foreground"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-card border-border"
              >
                <DropdownMenuItem
                  onClick={handleReport}
                  className="text-yellow-400 focus:text-yellow-400"
                >
                  Report Post
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleBlock}
                  className="text-red-400 focus:text-red-400"
                >
                  Block @{post.username}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {post.image && (
          <div className="w-full bg-muted">
            <img
              src={post.image}
              alt="Post"
              className="w-full max-h-96 object-cover"
              loading="lazy"
            />
          </div>
        )}

        {post.videoUrl && (
          <div className="w-full bg-muted">
            {/* biome-ignore lint/a11y/useMediaCaption: user-uploaded video */}
            <video src={post.videoUrl} controls className="w-full max-h-96">
              <track kind="captions" />
            </video>
          </div>
        )}

        <div className="px-4 pt-3 pb-1">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {post.caption}
          </p>
        </div>

        <div className="px-4 py-3 flex items-center justify-between border-t border-border mt-2">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "gap-1.5 text-sm px-2",
                isLiked ? "text-rose-400" : "text-muted-foreground",
              )}
              onClick={() => onLike(post.id)}
              data-ocid="feed.post.like_button"
            >
              <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
              {post.likes.length}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-sm text-muted-foreground px-2"
              onClick={() => setCommentsOpen(true)}
              data-ocid="feed.post.comment_button"
            >
              <MessageCircle className="w-4 h-4" />
              {post.comments.length}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-sm text-muted-foreground px-2"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "px-2",
              saved ? "text-primary" : "text-muted-foreground",
            )}
            onClick={() => setSaved((s) => !s)}
          >
            <Bookmark className={cn("w-4 h-4", saved && "fill-current")} />
          </Button>
        </div>
      </article>

      <Sheet open={commentsOpen} onOpenChange={setCommentsOpen}>
        <SheetContent
          side="right"
          className="bg-card border-border w-full sm:w-96"
          data-ocid="feed.comments.sheet"
        >
          <SheetHeader>
            <SheetTitle>Comments ({post.comments.length})</SheetTitle>
          </SheetHeader>
          <ScrollArea
            className="flex-1 mt-4"
            style={{ height: "calc(100vh - 160px)" }}
          >
            <div className="space-y-4 pr-2">
              {post.comments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No comments yet. Be the first!
                </p>
              ) : (
                post.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage src={comment.avatar} />
                      <AvatarFallback className="bg-muted text-xs">
                        {comment.displayName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 bg-muted rounded-xl px-3 py-2">
                      <p className="text-sm font-semibold">
                        {comment.displayName}
                      </p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {comment.text}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {comment.timestamp}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
          <div className="flex gap-2 mt-4 pt-4 border-t border-border">
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback className="bg-muted text-xs">
                {currentUser.displayName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex gap-2 flex-1">
              <Input
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleComment()}
                className="bg-muted border-border flex-1"
                data-ocid="feed.comment.input"
              />
              <Button
                size="icon"
                onClick={handleComment}
                className="nexus-accent-bg text-white flex-shrink-0"
                data-ocid="feed.comment.submit_button"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
