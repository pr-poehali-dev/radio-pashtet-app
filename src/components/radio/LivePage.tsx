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
  { id: 1, name: "Радио Паштет", freq: "102.3", show: "Прямой эфир", host: "Радио Паштет", listeners: "14.2K", genre: "Поп / Хиты", stream: STREAM_URL },
  { id: 2, name: "Радио Паштет", freq: "98.7", show: "Прямой эфир", host: "Радио Паштет", listeners: "8.9K", genre: "Рок / Металл", stream: STREAM_URL },
  { id: 3, name: "Радио Паштет", freq: "105.1", show: "Прямой эфир", host: "Радио Паштет", listeners: "5.1K", genre: "Джаз / Блюз", stream: STREAM_URL },
];

const RECENT_TRACKS = [
  { title: "Городская ночь", artist: "Сплин", time: "21:47" },
  { title: "Подожди", artist: "МУККА", time: "21:43" },
  { title: "Электрические сны", artist: "Би-2", time: "21:38" },
  { title: "Нить Ариадны", artist: "Земфира", time: "21:32" },
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
                src="https://cdn.poehali.dev/projects/67d51cef-c69a-4ce8-9708-d01ace2cf2f2/files/44c5900b-4cae-41e7-a5ce-b9a246654b77.jpg"
                alt="Radio"
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
                <p className="font-body text-sm text-muted-foreground">{station.freq} МГц</p>
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

      {/* Station switcher */}
      <div className="mb-6 animate-fade-up" style={{ animationDelay: "0.2s" }}>
        <h3 className="font-display text-lg font-medium text-foreground mb-3 uppercase tracking-wide">Станции</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {RADIO_STATIONS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActiveStation(i)}
              className={`flex-shrink-0 px-4 py-3 rounded-2xl transition-all text-left ${
                activeStation === i
                  ? "bg-[#FF6B2B] text-white glow-orange"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              <p className="font-display text-sm font-semibold">{s.name}</p>
              <p className="font-body text-xs opacity-80">{s.freq} МГц</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recently played */}
      <div className="animate-fade-up" style={{ animationDelay: "0.3s" }}>
        <h3 className="font-display text-lg font-medium text-foreground mb-3 uppercase tracking-wide">Недавно в эфире</h3>
        <div className="space-y-2">
          {RECENT_TRACKS.map((track, i) => (
            <div key={i} className="glass rounded-2xl px-4 py-3 flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B2B]/20 to-[#8B5CF6]/20 flex items-center justify-center flex-shrink-0">
                <Icon name="Music" size={14} className="text-[#FF6B2B]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-medium text-foreground truncate">{track.title}</p>
                <p className="font-body text-xs text-muted-foreground">{track.artist}</p>
              </div>
              <span className="font-body text-xs text-muted-foreground flex-shrink-0">{track.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LivePage;