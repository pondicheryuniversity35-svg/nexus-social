import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowRight, Camera, Check, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ImageCropModal } from "../components/ImageCropModal";
import type { User } from "../data/mockData";
import { useActor } from "../hooks/useActor";
import {
  getAvatarForGender,
  isUsernameTaken,
  registerUsername,
} from "../utils/username";

interface Props {
  principalId: string;
  onComplete: (user: User) => void;
}

export default function OnboardingPage({ principalId, onComplete }: Props) {
  const { actor } = useActor();
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [gender, setGender] = useState<"he" | "she" | "binary" | "">("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [rawImageUrl, setRawImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateUsername = (v: string) => /^[a-zA-Z0-9_]{3,20}$/.test(v);

  const handleNext = () => {
    if (step === 1) {
      if (!validateUsername(username)) {
        toast.error(
          "Username must be 3-20 characters: letters, numbers, underscores only",
        );
        return;
      }
      if (isUsernameTaken(username)) {
        toast.error("That username is already taken. Please choose another.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!displayName.trim()) {
        toast.error("Display name is required");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!gender.trim()) {
        toast.error("Please select your pronouns");
        return;
      }
      setStep(4);
    } else {
      handleComplete();
    }
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      if (actor) {
        await actor.saveCallerUserProfile({ name: displayName });
      }
    } catch (e) {
      console.error("Failed to save profile to backend:", e);
    }
    const resolvedGender: "he" | "she" | "binary" =
      (gender as "he" | "she" | "binary") || "binary";
    const resolvedAvatar =
      avatarUrl || getAvatarForGender(resolvedGender, username);
    registerUsername(username, principalId);
    const user: User = {
      id: principalId,
      username,
      displayName,
      avatar: resolvedAvatar,
      bio,
      isPrivate,
      followers: 0,
      following: 0,
      postCount: 0,
      gender: resolvedGender,
    };
    setLoading(false);
    toast.success("Welcome to Nexus!");
    onComplete(user);
  };

  const steps = [1, 2, 3, 4];
  const previewAvatar =
    avatarUrl ||
    getAvatarForGender(
      (gender as "he" | "she" | "binary") || "binary",
      username || "preview",
    );

  return (
    <>
      <div
        className="min-h-screen bg-background flex items-center justify-center p-4"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 50%, oklch(0.18 0.06 260 / 0.4) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, oklch(0.18 0.08 290 / 0.3) 0%, transparent 60%)",
        }}
      >
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl nexus-accent-bg mb-4">
              <span className="text-2xl font-black text-white">N</span>
            </div>
            <h1 className="text-2xl font-bold">Set Up Your Profile</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Step {step} of 4
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((num) => (
              <div
                key={num}
                className={`h-1.5 rounded-full transition-all ${
                  num <= step ? "w-8 bg-primary" : "w-4 bg-muted"
                }`}
              />
            ))}
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            {step === 1 && (
              <div className="space-y-2">
                <Label htmlFor="username">Choose a username</Label>
                <Input
                  id="username"
                  placeholder="your_username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  onKeyDown={(e) => e.key === "Enter" && handleNext()}
                  className="bg-muted border-border"
                  autoFocus
                  data-ocid="onboarding.username.input"
                />
                <p className="text-xs text-muted-foreground">
                  3-20 characters. Letters, numbers, underscores only. Must be
                  unique.
                </p>
              </div>
            )}

            {step === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display name</Label>
                  <Input
                    id="displayName"
                    placeholder="Your Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleNext()}
                    className="bg-muted border-border"
                    autoFocus
                    data-ocid="onboarding.displayname.input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio (optional)</Label>
                  <Input
                    id="bio"
                    placeholder="Tell people about yourself..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="bg-muted border-border"
                    data-ocid="onboarding.bio.input"
                  />
                </div>
              </>
            )}

            {step === 3 && (
              <div className="flex flex-col items-center gap-5">
                <div className="w-full space-y-2">
                  <Label className="text-sm font-medium">Your pronouns</Label>
                  <p className="text-xs text-muted-foreground">
                    This helps us pick a matching avatar style for you.
                  </p>
                  <div className="flex gap-2 mt-2">
                    {(
                      [
                        { value: "he", label: "He/Him" },
                        { value: "she", label: "She/Her" },
                        { value: "binary", label: "They/Them" },
                      ] as const
                    ).map(({ value, label }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setGender(value)}
                        className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium border transition-all ${
                          gender === value
                            ? "nexus-accent-bg text-white border-transparent"
                            : "bg-muted border-border text-muted-foreground hover:text-foreground"
                        }`}
                        data-ocid={`onboarding.gender.${value}.button`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 rounded-full bg-muted border-2 border-border overflow-hidden flex items-center justify-center">
                    {previewAvatar ? (
                      <img
                        src={previewAvatar}
                        alt="avatar preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleAvatarFileChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => fileInputRef.current?.click()}
                    data-ocid="onboarding.avatar.upload_button"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Photo
                  </Button>
                  {avatarUrl && (
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.7 0.15 145)" }}
                    >
                      Photo uploaded ✓
                    </p>
                  )}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4 p-4 bg-muted rounded-xl">
                  <div>
                    <p className="font-medium text-sm">Private Account</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      When private, only approved followers can see your posts.
                    </p>
                  </div>
                  <Switch
                    checked={isPrivate}
                    onCheckedChange={setIsPrivate}
                    data-ocid="onboarding.privacy.switch"
                  />
                </div>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <p className="text-sm font-medium mb-2">Your account</p>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>@{username}</p>
                    <p>{displayName}</p>
                    {bio && <p className="italic">{bio}</p>}
                    <p>{isPrivate ? "🔒 Private" : "🌐 Public"}</p>
                  </div>
                </div>
              </div>
            )}

            <Button
              className="w-full nexus-accent-bg text-white hover:opacity-90"
              onClick={handleNext}
              disabled={loading}
              data-ocid="onboarding.continue.button"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : step === 4 ? (
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4" /> Finish Setup
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Continue <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>

            {step === 3 && (
              <button
                type="button"
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setStep(4)}
                data-ocid="onboarding.skip.button"
              >
                Skip for now
              </button>
            )}
          </div>
        </div>
      </div>

      <ImageCropModal
        open={cropModalOpen}
        imageDataUrl={rawImageUrl}
        onConfirm={(url) => {
          setAvatarUrl(url);
          setCropModalOpen(false);
        }}
        onCancel={() => setCropModalOpen(false)}
      />
    </>
  );
}
