import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../../context/AppContext";
import { type Story, storyRingClasses } from "../../data/mockData";

interface Props {
  stories: Story[];
  onStoryClick: (index: number) => void;
  onAddStory: (story: Story) => void;
}

export default function StoryBar({ stories, onStoryClick, onAddStory }: Props) {
  const { currentUser } = useApp();
  const [addOpen, setAddOpen] = useState(false);
  const [storyUrl, setStoryUrl] = useState("");

  const handleAdd = () => {
    if (!storyUrl.trim()) return;
    const story: Story = {
      id: `story_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      displayName: currentUser.displayName,
      avatar: currentUser.avatar,
      image: storyUrl,
      timestamp: new Date().toISOString(),
    };
    onAddStory(story);
    setStoryUrl("");
    setAddOpen(false);
    toast.success("Story added!");
  };

  return (
    <>
      <div
        className="flex gap-4 overflow-x-auto pb-2 px-1"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="relative"
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center ring-2 ring-border">
              <Avatar className="w-14 h-14">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback className="bg-muted text-sm">
                  {currentUser.displayName[0]}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full nexus-accent-bg border-2 border-background flex items-center justify-center">
              <Plus className="w-3 h-3 text-white" />
            </div>
          </button>
          <span className="text-xs text-muted-foreground w-16 text-center truncate">
            Your Story
          </span>
        </div>

        {stories.map((story, idx) => {
          const ringClass = storyRingClasses[idx % storyRingClasses.length];
          return (
            <button
              type="button"
              key={story.id}
              className="flex flex-col items-center gap-1.5 flex-shrink-0"
              onClick={() => onStoryClick(idx)}
            >
              <div className={`w-16 h-16 rounded-full p-0.5 ${ringClass}`}>
                <div className="w-full h-full rounded-full bg-background p-0.5">
                  <Avatar className="w-full h-full">
                    <AvatarImage src={story.avatar} />
                    <AvatarFallback className="bg-muted text-sm">
                      {story.displayName[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <span className="text-xs text-foreground w-16 text-center truncate font-medium">
                {story.username}
              </span>
            </button>
          );
        })}
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="bg-card border-border sm:max-w-sm">
          <h3 className="text-base font-semibold">Add Story</h3>
          <div className="space-y-3">
            <Input
              placeholder="Image URL for your story..."
              value={storyUrl}
              onChange={(e) => setStoryUrl(e.target.value)}
              className="bg-muted border-border"
              autoFocus
            />
            {storyUrl && (
              <img
                src={storyUrl}
                alt="preview"
                className="w-full h-48 object-cover rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
            <Button
              className="w-full nexus-accent-bg text-white"
              onClick={handleAdd}
              disabled={!storyUrl.trim()}
            >
              Share Story
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
