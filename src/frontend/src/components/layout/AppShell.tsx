import { useApp } from "../../context/AppContext";
import ExplorePage from "../../pages/ExplorePage";
import FeedPage from "../../pages/FeedPage";
import MessagesPage from "../../pages/MessagesPage";
import ProfilePage from "../../pages/ProfilePage";
import ServersPage from "../../pages/ServersPage";
import SettingsPage from "../../pages/SettingsPage";
import BottomNav from "./BottomNav";
import Header from "./Header";
import RightPanel from "./RightPanel";
import Sidebar from "./Sidebar";

export default function AppShell() {
  const { activeTab } = useApp();

  const renderPage = () => {
    switch (activeTab) {
      case "feed":
        return <FeedPage />;
      case "messages":
        return <MessagesPage />;
      case "servers":
        return <ServersPage />;
      case "explore":
        return <ExplorePage />;
      case "profile":
        return <ProfilePage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <FeedPage />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <div
        className="flex flex-1 overflow-hidden"
        style={{ height: "calc(100vh - 56px)" }}
      >
        <Sidebar />
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          {renderPage()}
        </main>
        <RightPanel />
      </div>
      <BottomNav />
    </div>
  );
}
