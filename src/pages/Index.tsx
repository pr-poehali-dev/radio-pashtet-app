import { useState } from "react";
import LivePage from "@/components/radio/LivePage";
import SchedulePage from "@/components/radio/SchedulePage";
import AccountPage from "@/components/radio/AccountPage";
import BottomNav from "@/components/radio/BottomNav";
import MiniPlayer from "@/components/radio/MiniPlayer";

export type Page = "live" | "schedule" | "account";
export type NowPlaying = { title: string; artist: string } | null;

const Index = () => {
  const [activePage, setActivePage] = useState<Page>("live");
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(75);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying>(null);

  return (
    <div className="min-h-screen bg-background gradient-mesh relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#FF6B2B]/5 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-15%] w-[400px] h-[400px] rounded-full bg-[#8B5CF6]/8 blur-[100px]" />
        <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full bg-[#14B8A6]/5 blur-[80px]" />
      </div>

      <div className="relative z-10 pb-40">
        {activePage === "live" && (
          <LivePage
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            volume={volume}
            setVolume={setVolume}
            onNowPlaying={setNowPlaying}
          />
        )}
        {activePage === "schedule" && <SchedulePage />}
        {activePage === "account" && <AccountPage />}
      </div>

      {activePage !== "live" && (
        <MiniPlayer
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          onOpen={() => setActivePage("live")}
          nowPlaying={nowPlaying}
        />
      )}

      <BottomNav activePage={activePage} setActivePage={setActivePage} />
    </div>
  );
};

export default Index;