import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import AppShell from "./components/layout/AppShell";
import { AppProvider } from "./context/AppContext";
import type { User } from "./data/mockData";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import AuthPage from "./pages/AuthPage";
import OnboardingPage from "./pages/OnboardingPage";

export default function App() {
  const { identity, isInitializing, clear } = useInternetIdentity();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [checkingProfile, setCheckingProfile] = useState(true);

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const principalId = isAuthenticated
    ? identity!.getPrincipal().toString()
    : null;

  useEffect(() => {
    if (!isAuthenticated) {
      setCurrentUser(null);
      setCheckingProfile(false);
      return;
    }
    if (!principalId) return;
    const stored = localStorage.getItem(`nexus_profile_${principalId}`);
    if (stored) {
      setCurrentUser(JSON.parse(stored));
    } else {
      setCurrentUser(null);
    }
    setCheckingProfile(false);
  }, [isAuthenticated, principalId]);

  const handleOnboarded = (user: User) => {
    localStorage.setItem(`nexus_profile_${user.id}`, JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    clear();
  };

  if (isInitializing || (isAuthenticated && checkingProfile)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl nexus-accent-bg flex items-center justify-center animate-pulse">
            <span className="text-xl font-bold text-white">N</span>
          </div>
          <p className="text-muted-foreground text-sm">Loading Nexus...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <AuthPage />
        <Toaster />
      </>
    );
  }

  if (!currentUser) {
    return (
      <>
        <OnboardingPage
          principalId={principalId!}
          onComplete={handleOnboarded}
        />
        <Toaster />
      </>
    );
  }

  return (
    <AppProvider initialUser={currentUser} onLogout={handleLogout}>
      <AppShell />
      <Toaster />
    </AppProvider>
  );
}
