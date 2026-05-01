import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Bell,
  Camera,
  ChevronRight,
  Lock,
  LogOut,
  Palette,
  User,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ImageCropModal } from "../components/ImageCropModal";
import { useApp } from "../context/AppContext";
import {
  isUsernameTaken,
  registerUsername,
  releaseUsername,
} from "../utils/username";

export default function SettingsPage() {
  const { currentUser, setCurrentUser, logout, blockedUsers, unblockUser } =
    useApp();
  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [username, setUsername] = useState(currentUser.username);
  const [bio, setBio] = useState(currentUser.bio);
  const [avatarPreview, setAvatarPreview] = useState(currentUser.avatar);
  const [notifPosts, setNotifPosts] = useState(true);
  const [notifMessages, setNotifMessages] = useState(true);
  const [notifMentions, setNotifMentions] = useState(true);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [rawImageUrl, setRawImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = (ev.target?.result as string) || "";
      if (url) {
        setRawImageUrl(url);
        setCropModalOpen(true);
      }
    };
    reader.readAsDataURL(file);
    // Reset so same file can be re-selected
    e.target.value = "";
  };

  const handleSaveAccount = () => {
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      toast.error(
        "Username must be 3-20 characters: letters, numbers, underscores only",
      );
      return;
    }
    if (
      username !== currentUser.username &&
      isUsernameTaken(username, currentUser.id)
    ) {
      toast.error("That username is already taken");
      return;
    }
    if (username !== currentUser.username) {
      releaseUsername(currentUser.username);
      registerUsername(username, currentUser.id);
    }
    setCurrentUser({
      ...currentUser,
      displayName,
      username,
      bio,
      avatar: avatarPreview,
    });
    toast.success("Account settings saved!");
  };

  const handlePrivacyToggle = () => {
    setCurrentUser({ ...currentUser, isPrivate: !currentUser.isPrivate });
    toast.success(
      currentUser.isPrivate
        ? "Account set to public"
        : "Account set to private",
    );
  };

  return (
    <>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        <h1 className="text-2xl font-bold">Settings</h1>

        <section className="bg-card border border-border rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 nexus-accent" />
            <h2 className="font-semibold text-lg">Account</h2>
          </div>
          <Separator className="bg-border" />
          <div className="space-y-4">
            {/* Profile Picture */}
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                className="relative cursor-pointer group focus:outline-none"
                onClick={() => fileInputRef.current?.click()}
                data-ocid="settings.avatar.button"
                aria-label="Change profile photo"
              >
                <Avatar className="w-20 h-20 border-2 border-border">
                  <AvatarImage src={avatarPreview} alt="Profile picture" />
                  <AvatarFallback className="bg-muted text-lg">
                    {currentUser.displayName[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full nexus-accent-bg flex items-center justify-center shadow-md border border-background">
                  <Camera className="w-3 h-3 text-white" />
                </div>
                <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </button>
              <p className="text-xs text-muted-foreground">
                Tap to change photo
              </p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleAvatarChange}
              />
            </div>

            <div className="space-y-2">
              <Label>Display Name</Label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="bg-muted border-border"
                data-ocid="settings.account.name.input"
              />
            </div>
            <div className="space-y-2">
              <Label>Username</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-muted border-border"
                data-ocid="settings.account.username.input"
              />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="bg-muted border-border resize-none"
                rows={3}
                data-ocid="settings.account.bio.textarea"
              />
            </div>
            <Button
              className="nexus-accent-bg text-white"
              onClick={handleSaveAccount}
              data-ocid="settings.account.save_button"
            >
              Save Changes
            </Button>
          </div>
        </section>

        <section className="bg-card border border-border rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 nexus-accent" />
            <h2 className="font-semibold text-lg">Privacy</h2>
          </div>
          <Separator className="bg-border" />
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="font-medium">Private Account</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Only approved followers can see your posts
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-border text-xs">
                {currentUser.isPrivate ? "Private" : "Public"}
              </Badge>
              <Switch
                checked={currentUser.isPrivate}
                onCheckedChange={handlePrivacyToggle}
                data-ocid="settings.privacy.switch"
              />
            </div>
          </div>
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="font-medium">Show Activity Status</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Let others see when you&apos;re online
              </p>
            </div>
            <Switch defaultChecked data-ocid="settings.activity.switch" />
          </div>
        </section>

        {blockedUsers.length > 0 && (
          <section className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 nexus-accent" />
              <h2 className="font-semibold text-lg">Blocked Users</h2>
            </div>
            <Separator className="bg-border" />
            <div className="space-y-3">
              {blockedUsers.map((userId) => (
                <div key={userId} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-muted text-xs">
                        {userId[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm text-muted-foreground font-mono text-xs">
                      {userId.slice(0, 20)}...
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs"
                    onClick={() => {
                      unblockUser(userId);
                      toast.success("User unblocked");
                    }}
                  >
                    <X className="w-3 h-3" /> Unblock
                  </Button>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="bg-card border border-border rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 nexus-accent" />
            <h2 className="font-semibold text-lg">Notifications</h2>
          </div>
          <Separator className="bg-border" />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">New Posts</p>
                <p className="text-sm text-muted-foreground">
                  From people you follow
                </p>
              </div>
              <Switch
                checked={notifPosts}
                onCheckedChange={setNotifPosts}
                data-ocid="settings.notif_posts.switch"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Messages</p>
                <p className="text-sm text-muted-foreground">
                  Direct messages and group chats
                </p>
              </div>
              <Switch
                checked={notifMessages}
                onCheckedChange={setNotifMessages}
                data-ocid="settings.notif_messages.switch"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Mentions</p>
                <p className="text-sm text-muted-foreground">
                  When someone tags you
                </p>
              </div>
              <Switch
                checked={notifMentions}
                onCheckedChange={setNotifMentions}
                data-ocid="settings.notif_mentions.switch"
              />
            </div>
          </div>
        </section>

        <section className="bg-card border border-border rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 nexus-accent" />
            <h2 className="font-semibold text-lg">Appearance</h2>
          </div>
          <Separator className="bg-border" />
          <div className="flex items-center justify-between py-1 text-muted-foreground">
            <p className="text-sm">Theme customization</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-border text-xs">
                Coming Soon
              </Badge>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </section>

        <div className="pb-4">
          <Button
            variant="outline"
            className="w-full border-destructive/50 text-destructive hover:bg-destructive/10 gap-2"
            onClick={logout}
            data-ocid="settings.logout.button"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>

        <footer className="text-center text-xs text-muted-foreground pb-6">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="nexus-accent hover:underline"
          >
            caffeine.ai
          </a>
        </footer>
      </div>

      <ImageCropModal
        open={cropModalOpen}
        imageDataUrl={rawImageUrl}
        onConfirm={(url) => {
          setAvatarPreview(url);
          setCropModalOpen(false);
        }}
        onCancel={() => setCropModalOpen(false)}
      />
    </>
  );
}
