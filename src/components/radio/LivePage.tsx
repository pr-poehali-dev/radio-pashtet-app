import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const STREAM_URL = "https://volnorez.com/radio-pashtet/bc";

interface LivePageProps {
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
  volume: number;
  setVolume: (v: number) => void;
  onNowPlaying?: (v: { title: string; artist: string } | null) => void;
}

const RADIO_STATIONS = [
  { id: 1, name: "Радио Паштет", show: "Прямой эфир", host: "Егор Грачев", listeners: "14.2K", genre: "Интернет-радио", stream: STREAM_URL },
];


const LivePage = ({ isPlaying, setIsPlaying, volume, setVolume, onNowPlaying }: LivePageProps) => {
  const [activeStation, setActiveStation] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nowPlaying, setNowPlaying] = useState<{ title: string; artist: string } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const metaIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const station = RADIO_STATIONS[activeStation];

  const updateNowPlaying = (val: { title: string; artist: string } | null) => {
    setNowPlaying(val);
    onNowPlaying?.(val);
  };

  const fetchNowPlaying = async () => {
    try {
      const res = await fetch(`https://volnorez.com/ajax/nowplaying?station=radio-pashtet&_=${Date.now()}`);
      const text = await res.text();
      if (text && text.trim()) {
        try {
          const data = JSON.parse(text);
          const raw: string = data.title || data.track || data.song || data.current_song || "";
          if (raw) {
            const parts = raw.split(" - ");
            updateNowPlaying(parts.length >= 2
              ? { artist: parts[0].trim(), title: parts.slice(1).join(" - ").trim() }
              : { artist: "", title: raw.trim() }
            );
          }
        } catch {
          if (text.includes(" - ")) {
            const parts = text.split(" - ");
            updateNowPlaying({ artist: parts[0].trim(), title: parts.slice(1).join(" - ").trim() });
          }
        }
      }
    } catch {
      // API недоступен — используем ICY метаданные
    }
  };

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = "none";
    }
    const audio = audioRef.current;
    audio.onwaiting = () => setLoading(true);
    audio.onplaying = () => setLoading(false);
    audio.onerror = () => setLoading(false);

    // Слушаем ICY метаданные через нативный API
    const handleMeta = () => {
      // @ts-expect-error нестандартный API
      const track = audio?.mozGetMetadata?.();
      if (track?.StreamTitle) {
        const parts = (track.StreamTitle as string).split(" - ");
        updateNowPlaying(parts.length >= 2
          ? { artist: parts[0].trim(), title: parts.slice(1).join(" - ").trim() }
          : { artist: "", title: track.StreamTitle }
        );
      }
    };
    audio.addEventListener("mozaudiometadata", handleMeta);

    return () => {
      audio.removeEventListener("mozaudiometadata", handleMeta);
      audio.pause();
      audio.src = "";
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      setLoading(true);
      audio.src = station.stream;
      audio.play().catch(() => setLoading(false));
      fetchNowPlaying();
      metaIntervalRef.current = setInterval(fetchNowPlaying, 15000);
    } else {
      audio.pause();
      audio.src = "";
      setLoading(false);
      if (metaIntervalRef.current) clearInterval(metaIntervalRef.current);
    }
    return () => {
      if (metaIntervalRef.current) clearInterval(metaIntervalRef.current);
    };
  }, [isPlaying, activeStation]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  return (
    <div className="min-h-screen px-4 pt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-up">
        <div>
          <p className="text-xs font-body text-muted-foreground uppercase tracking-widest mb-1">Прямой эфир</p>
          <h1 className="font-display text-3xl font-semibold text-foreground">СЕЙЧАС В ЭФИРЕ</h1>
        </div>
        <div className="flex items-center gap-2 glass rounded-full px-3 py-2">
          <span className="w-2 h-2 rounded-full bg-[#FF6B2B] animate-pulse" />
          <span className="text-xs font-body text-[#FF6B2B] font-medium">LIVE</span>
        </div>
      </div>

      {/* Main player card */}
      <div className="glass rounded-3xl p-6 mb-6 relative overflow-hidden animate-fade-up" style={{ animationDelay: "0.1s" }}>
        {/* Glow behind */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF6B2B] via-[#8B5CF6] to-[#14B8A6]" />

        <div className="flex gap-5 mb-6">
          {/* Album art with rotation */}
          <div className="relative flex-shrink-0">
            <div
              className={`w-24 h-24 rounded-2xl overflow-hidden ${isPlaying ? "animate-spin-slow" : ""}`}
              style={{ animationDuration: "12s" }}
            >
              <img
                src="https://cdn.poehali.dev/projects/67d51cef-c69a-4ce8-9708-d01ace2cf2f2/bucket/9f6ae5b4-abee-4222-b9b4-261ea0186f6a.jpg"
                alt="Радио Паштет"
                className="w-full h-full object-cover"
              />
            </div>
            {isPlaying && (
              <div className="absolute inset-0 rounded-2xl border-2 border-[#FF6B2B]/40 animate-pulse-ring" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="font-display text-2xl font-semibold neon-orange mb-1">{station.name}</h2>
              </div>
              <button
                onClick={() => setLiked(!liked)}
                className="p-2 glass rounded-xl transition-all hover:scale-110"
              >
                <Icon name={liked ? "Heart" : "Heart"} size={18} className={liked ? "text-[#FF6B2B] fill-[#FF6B2B]" : "text-muted-foreground"} />
              </button>
            </div>
            <div className="mt-3">
              {nowPlaying ? (
                <div className="animate-fade-up">
                  <p className="font-body text-sm font-medium text-foreground truncate">{nowPlaying.title}</p>
                  {nowPlaying.artist && (
                    <p className="font-body text-xs text-muted-foreground truncate">{nowPlaying.artist}</p>
                  )}
                </div>
              ) : (
                <>
                  <p className="font-body text-sm font-medium text-foreground">{station.show}</p>
                  <p className="font-body text-xs text-muted-foreground">Ведущий: {station.host}</p>
                </>
              )}
            </div>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1">
                <Icon name="Users" size={12} className="text-[#14B8A6]" />
                <span className="text-xs font-body text-[#14B8A6]">{station.listeners}</span>
              </div>
              <span className="text-xs font-body text-muted-foreground">{station.genre}</span>
            </div>
          </div>
        </div>

        {/* Equalizer */}
        {isPlaying && (
          <div className="flex items-end gap-1 h-6 mb-4">
            {[14, 20, 10, 18, 12, 22, 8, 16, 20, 12, 18, 10, 22, 14, 20].map((h, i) => (
              <div
                key={i}
                className="eq-bar flex-1 bg-gradient-to-t from-[#FF6B2B] to-[#8B5CF6]"
                style={{
                  height: `${h}px`,
                  animationDelay: `${(i * 0.08).toFixed(2)}s`,
                  animationDuration: `${0.6 + (i % 3) * 0.15}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between">
          <button className="p-3 glass rounded-2xl hover:scale-105 transition-all">
            <Icon name="SkipBack" size={20} className="text-foreground" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-105 animate-glow-pulse"
            style={{ background: "linear-gradient(135deg, #FF6B2B, #E85D20)" }}
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Icon name={isPlaying ? "Pause" : "Play"} size={28} className="text-white" />
            )}
          </button>

          <button className="p-3 glass rounded-2xl hover:scale-105 transition-all">
            <Icon name="SkipForward" size={20} className="text-foreground" />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-3 mt-5">
          <Icon name="Volume1" size={16} className="text-muted-foreground flex-shrink-0" />
          <div className="flex-1 h-1.5 bg-muted rounded-full relative cursor-pointer" onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
            setVolume(Math.max(0, Math.min(100, pct)));
          }}>
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#FF6B2B] to-[#8B5CF6] relative"
              style={{ width: `${volume}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg" />
            </div>
          </div>
          <Icon name="Volume2" size={16} className="text-muted-foreground flex-shrink-0" />
          <span className="text-xs font-body text-muted-foreground w-8 text-right">{volume}%</span>
        </div>
      </div>


    </div>
  );
};

export default LivePage;