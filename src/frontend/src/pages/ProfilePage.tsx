import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Grid3X3, Lock, Unlock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";

export default function ProfilePage() {
  const { currentUser, setCurrentUser, posts } = useApp();
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState(currentUser.displayName);
  const [editUsername, setEditUsername] = useState(currentUser.username);
  const [editBio, setEditBio] = useState(currentUser.bio);
  const [editAvatar, setEditAvatar] = useState(currentUser.avatar);

  const myPosts = posts.filter((p) => p.userId === currentUser.id);

  const handleSave = () => {
    setCurrentUser({
      ...currentUser,
      displayName: editName,
      username: editUsername,
      bio: editBio,
      avatar: editAvatar,
      postCount: myPosts.length,
    });
    setEditOpen(false);
    toast.success("Profile updated!");
  };

  const togglePrivacy = () => {
    setCurrentUser({ ...currentUser, isPrivate: !currentUser.isPrivate });
    toast.success(
      currentUser.isPrivate
        ? "Account is now public"
        : "Account is now private",
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="h-40 sm:h-52 bg-gradient-to-br from-primary/30 via-card to-muted relative">
        <div className="absolute inset-0 bg-background/40" />
      </div>

      <div className="px-4 pb-6">
        <div className="flex items-end justify-between -mt-12 mb-4">
          <div className="ring-4 ring-background rounded-full">
            <Avatar className="w-24 h-24">
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback className="bg-muted text-2xl">
                {currentUser.displayName[0]}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex gap-2 pb-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-border"
              onClick={togglePrivacy}
              data-ocid="profile.privacy.toggle"
            >
              {currentUser.isPrivate ? (
                <>
                  <Lock className="w-3.5 h-3.5" /> Private
                </>
              ) : (
                <>
                  <Unlock className="w-3.5 h-3.5" /> Public
                </>
              )}
            </Button>
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="nexus-accent-bg text-white gap-1.5"
                  data-ocid="profile.edit.open_modal_button"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent
                className="bg-card border-border"
                data-ocid="profile.edit.dialog"
              >
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label>Display Name</Label>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-muted border-border"
                      data-ocid="profile.edit.name.input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Username</Label>
                    <Input
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                      className="bg-muted border-border"
                      data-ocid="profile.edit.username.input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bio</Label>
                    <Textarea
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      className="bg-muted border-border resize-none"
                      rows={3}
                      data-ocid="profile.edit.bio.textarea"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Profile Photo URL</Label>
                    <Input
                      value={editAvatar}
                      onChange={(e) => setEditAvatar(e.target.value)}
                      className="bg-muted border-border"
                      placeholder="https://..."
                    />
                    {editAvatar && (
                      <img
                        src={editAvatar}
                        alt="preview"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <p className="text-sm font-medium">Private Account</p>
                      <p className="text-xs text-muted-foreground">
                        Only followers see your posts
                      </p>
                    </div>
                    <Switch
                      checked={currentUser.isPrivate}
                      onCheckedChange={togglePrivacy}
                      data-ocid="profile.edit.privacy.switch"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setEditOpen(false)}
                      data-ocid="profile.edit.cancel_button"
                    >
                      Cancel
                    </Button>
                    <Button
                      className="nexus-accent-bg text-white"
                      onClick={handleSave}
                      data-ocid="profile.edit.save_button"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">{currentUser.displayName}</h1>
            {currentUser.isPrivate && (
              <Badge variant="outline" className="text-xs border-border">
                <Lock className="w-2.5 h-2.5 mr-1" /> Private
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            @{currentUser.username}
          </p>
          {currentUser.bio && <p className="text-sm mt-2">{currentUser.bio}</p>}
        </div>

        <div className="flex gap-6 mt-4 border-t border-border pt-4">
          <div className="text-center">
            <p className="text-lg font-bold">{myPosts.length}</p>
            <p className="text-xs text-muted-foreground">Posts</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold">
              {currentUser.followers.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold">
              {currentUser.following.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Following</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Grid3X3 className="w-4 h-4" />
            <span className="text-sm font-semibold">Posts</span>
          </div>
          {myPosts.length === 0 ? (
            <div
              className="text-center text-muted-foreground py-12"
              data-ocid="profile.posts.empty_state"
            >
              <p className="text-4xl mb-3">📸</p>
              <p className="font-medium">No posts yet</p>
              <p className="text-sm mt-1">
                Share a photo, video, or text to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {myPosts.map((post, idx) => (
                <div key={post.id} data-ocid={`profile.post.item.${idx + 1}`}>
                  {post.image ? (
                    <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                      <img
                        src={post.image}
                        alt="Post"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="bg-muted rounded-xl p-4">
                      <p className="text-sm">{post.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
