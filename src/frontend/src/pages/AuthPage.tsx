import { Button } from "@/components/ui/button";
import { Fingerprint, Shield, Smartphone } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function AuthPage() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div
      className="min-h-screen bg-background flex items-center justify-center p-4"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 20% 50%, oklch(0.18 0.06 260 / 0.4) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, oklch(0.18 0.08 290 / 0.3) 0%, transparent 60%)",
      }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl nexus-accent-bg mb-5 shadow-lg">
            <span className="text-3xl font-black text-white">N</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            NEXUS
          </h1>
          <p className="text-muted-foreground mt-2 text-base">
            Connect. Share. Discover.
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-lg space-y-6">
          <div className="space-y-1 text-center">
            <h2 className="text-lg font-semibold">Welcome to Nexus Social</h2>
            <p className="text-sm text-muted-foreground">
              Sign in securely with Internet Identity — no password needed.
            </p>
          </div>

          <Button
            className="w-full h-12 text-base font-semibold nexus-accent-bg text-white hover:opacity-90"
            onClick={login}
            disabled={isLoggingIn}
            data-ocid="auth.login.submit_button"
          >
            {isLoggingIn ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Connecting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Fingerprint className="w-5 h-5" />
                Sign in with Internet Identity
              </span>
            )}
          </Button>

          <div className="grid grid-cols-3 gap-3 pt-1">
            {[
              { icon: Fingerprint, label: "Face ID / Touch ID" },
              { icon: Smartphone, label: "Passkeys" },
              { icon: Shield, label: "Hardware Keys" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1.5 p-3 bg-muted rounded-xl"
              >
                <Icon className="w-5 h-5 text-primary" />
                <span className="text-[10px] text-muted-foreground text-center leading-tight">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Internet Identity is a privacy-first authentication system built on
            the Internet Computer. One identity, all your devices.
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          © {new Date().getFullYear()}. Built with{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="nexus-accent hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
