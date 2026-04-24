import Icon from "@/components/ui/icon";

interface MiniPlayerProps {
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
  onOpen: () => void;
}

const MiniPlayer = ({ isPlaying, setIsPlaying, onOpen }: MiniPlayerProps) => {
  return (
    <div className="fixed bottom-24 left-4 right-4 z-40 mx-auto max-w-sm animate-fade-up">
      <div
        className="glass rounded-2xl px-4 py-3 flex items-center gap-3 border border-[#FF6B2B]/20"
        style={{ boxShadow: "0 4px 30px rgba(255, 107, 43, 0.15)" }}
      >
        {/* Live dot */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#FF6B2B] animate-pulse" />
          <span className="font-display text-xs text-[#FF6B2B] font-medium">LIVE</span>
        </div>

        {/* Info */}
        <button onClick={onOpen} className="flex-1 min-w-0 text-left">
          <p className="font-body text-sm font-medium text-foreground truncate">Волна FM — 102.3 МГц</p>
          <p className="font-body text-xs text-muted-foreground truncate">Утреннее шоу · Алексей Морозов</p>
        </button>

        {/* Equalizer or pause indicator */}
        {isPlaying && (
          <div className="flex items-end gap-0.5 h-4 flex-shrink-0">
            {[12, 16, 8, 14, 10].map((h, i) => (
              <div
                key={i}
                className="eq-bar w-1 bg-[#FF6B2B]"
                style={{ height: `${h}px`, animationDelay: `${i * 0.12}s` }}
              />
            ))}
          </div>
        )}

        {/* Play/pause */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-9 h-9 rounded-full bg-[#FF6B2B] flex items-center justify-center flex-shrink-0 hover:scale-110 transition-all"
        >
          <Icon name={isPlaying ? "Pause" : "Play"} size={16} className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default MiniPlayer;
