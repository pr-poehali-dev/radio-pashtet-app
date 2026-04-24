import Icon from "@/components/ui/icon";

const SchedulePage = () => {
  return (
    <div className="min-h-screen px-4 pt-8">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <p className="text-xs font-body text-muted-foreground uppercase tracking-widest mb-1">Программа передач</p>
        <h1 className="font-display text-3xl font-semibold text-foreground">РАСПИСАНИЕ</h1>
      </div>

      {/* Info block */}
      <div className="glass rounded-3xl p-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-[#8B5CF6]/20 flex items-center justify-center flex-shrink-0">
            <Icon name="Info" size={20} className="text-[#8B5CF6]" />
          </div>
          <h2 className="font-display text-xl font-semibold text-foreground uppercase tracking-wide">Как читать расписание</h2>
        </div>

        <div className="space-y-4">
          {/* Case 1 — 00:00 */}
          <div className="glass rounded-2xl p-4 flex gap-4 items-start" style={{ borderLeft: "3px solid #6366F1" }}>
            <div className="flex-shrink-0 pt-0.5">
              <p className="font-display text-lg font-semibold text-[#6366F1]">00:00</p>
              <p className="font-display text-sm font-semibold text-[#6366F1] opacity-60">00:00</p>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-muted-foreground flex-shrink-0" />
                <p className="font-body text-sm font-semibold text-muted-foreground">Время не определено</p>
              </div>
              <p className="font-body text-sm text-foreground leading-relaxed">
                Если в расписании указано <span className="font-semibold text-[#6366F1]">00:00 — 00:00</span>, значит время эфира этой передачи пока ещё не определилось. Следи за обновлениями!
              </p>
            </div>
          </div>

          {/* Case 2 — real time */}
          <div className="glass rounded-2xl p-4 flex gap-4 items-start" style={{ borderLeft: "3px solid #14B8A6" }}>
            <div className="flex-shrink-0 pt-0.5">
              <p className="font-display text-lg font-semibold text-[#14B8A6]">18:00</p>
              <p className="font-display text-sm font-semibold text-[#14B8A6] opacity-60">18:30</p>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#14B8A6] animate-pulse flex-shrink-0" />
                <p className="font-body text-sm font-semibold text-[#14B8A6]">Эфир идёт</p>
              </div>
              <p className="font-body text-sm text-foreground leading-relaxed">
                Если указано конкретное время, например <span className="font-semibold text-[#14B8A6]">18:00 — 18:30</span>, значит передача выходит в эфир в это время. Не пропусти!
              </p>
            </div>
          </div>
        </div>

        {/* Bell tip */}
        <div className="mt-5 flex items-start gap-3 px-4 py-3 rounded-2xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20">
          <Icon name="BellRing" size={16} className="text-[#8B5CF6] flex-shrink-0 mt-0.5" />
          <p className="font-body text-xs text-muted-foreground leading-relaxed">
            Подпишись на передачу — нажми 🔔 рядом с ней, и мы пришлём уведомление за 5 минут до начала эфира.
          </p>
        </div>
      </div>

      {/* Coming soon */}
      <div className="mt-6 glass rounded-3xl p-6 flex flex-col items-center text-center animate-fade-up" style={{ animationDelay: "0.2s" }}>
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF6B2B]/20 to-[#8B5CF6]/20 flex items-center justify-center mb-4">
          <Icon name="CalendarDays" size={26} className="text-[#FF6B2B]" />
        </div>
        <h3 className="font-display text-lg font-semibold text-foreground uppercase tracking-wide mb-2">Расписание скоро появится</h3>
        <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-xs">
          Полная программа передач «Радио Паштет» будет опубликована здесь. Следи за обновлениями!
        </p>
      </div>

      <div className="h-4" />
    </div>
  );
};

export default SchedulePage;
