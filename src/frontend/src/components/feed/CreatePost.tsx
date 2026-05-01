import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Image, Send, Video } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../../context/AppContext";
import type { Post } from "../../data/mockData";

interface Props {
  onPost: (post: Post) => void;
}

export default function CreatePost({ onPost }: Props) {
  const { currentUser } = useApp();
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [posting, setPosting] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [open, setOpen] = useState(false);

  const mediaType = videoUrl ? "video" : imageUrl ? "image" : "text";

  const handlePost = async () => {
    if (!caption.trim()) return;
    setPosting(true);
    await new Promise((r) => setTimeout(r, 300));
    const newPost: Post = {
      id: `p_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      displayName: currentUser.displayName,
      avatar: currentUser.avatar,
      caption: caption.trim(),
      image: imageUrl || undefined,
      videoUrl: videoUrl || undefined,
      mediaType,
      likes: [],
      comments: [],
      timestamp: new Date().toISOString(),
      hashtags: [],
    };
    onPost(newPost);
    setCaption("");
    setImageUrl("");
    setVideoUrl("");
    setShowImageInput(false);
    setShowVideoInput(false);
    setPosting(false);
    setOpen(false);
    toast.success("Post shared!");
  };

  return (
    <>
      <button
        type="button"
        className="w-full bg-card border border-border rounded-2xl p-4 cursor-pointer hover:border-primary/30 transition-colors text-left"
        onClick={() => setOpen(true)}
      >
        <div className="flex gap-3 items-center">
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarImage src={currentUser.avatar} />
            <AvatarFallback className="bg-muted">
              {currentUser.displayName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 bg-muted rounded-xl px-4 py-2.5 text-sm text-muted-foreground">
            What's on your mind, {currentUser.displayName.split(" ")[0]}?
          </div>
        </div>
        <div className="flex gap-3 mt-3">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground px-3 py-1.5 rounded-lg">
            <Image className="w-4 h-4" /> Photo
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground px-3 py-1.5 rounded-lg">
            <Video className="w-4 h-4" /> Video
          </span>
        </div>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card border-border sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-3">
              <Avatar className="w-10 h-10 flex-shrink-0">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback className="bg-muted">
                  {currentUser.displayName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-semibold">
                  {currentUser.displayName}
                </p>
                <p className="text-xs text-muted-foreground">
                  @{currentUser.username}
                </p>
              </div>
            </div>

            <Textarea
              placeholder="What's on your mind?"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="bg-muted border-border resize-none min-h-[100px]"
              autoFocus
              data-ocid="feed.create_post.textarea"
            />

            <div className="flex gap-2">
              <Button
                variant={showImageInput ? "default" : "outline"}
                size="sm"
                className="gap-1.5 text-xs"
                onClick={() => {
                  setShowImageInput(!showImageInput);
                  setShowVideoInput(false);
                }}
                data-ocid="feed.create_post.image.upload_button"
              >
                <Image className="w-3.5 h-3.5" /> Photo
              </Button>
              <Button
                variant={showVideoInput ? "default" : "outline"}
                size="sm"
                className="gap-1.5 text-xs"
                onClick={() => {
                  setShowVideoInput(!showVideoInput);
                  setShowImageInput(false);
                }}
                data-ocid="feed.create_post.video.upload_button"
              >
                <Video className="w-3.5 h-3.5" /> Video
              </Button>
            </div>

            {showImageInput && (
              <div className="space-y-1">
                <Label className="text-xs">Image URL</Label>
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="bg-muted border-border text-sm"
                />
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="preview"
                    className="w-full h-40 object-cover rounded-lg mt-2"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
              </div>
            )}

            {showVideoInput && (
              <div className="space-y-1">
                <Label className="text-xs">Video URL</Label>
                <Input
                  placeholder="https://example.com/video.mp4"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="bg-muted border-border text-sm"
                />
              </div>
            )}

            <Button
              className="w-full nexus-accent-bg text-white gap-1.5"
              onClick={handlePost}
              disabled={!caption.trim() || posting}
              data-ocid="feed.create_post.submit_button"
            >
              <Send className="w-4 h-4" />
              {posting ? "Posting..." : "Share Post"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
