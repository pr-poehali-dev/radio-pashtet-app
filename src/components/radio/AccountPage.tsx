import { useState } from "react";
import Icon from "@/components/ui/icon";

const HISTORY = [
  { show: "Утреннее шоу", date: "Сегодня", progress: 78, duration: "3 ч" },
  { show: "Вечерний джем", date: "Вчера", progress: 100, duration: "3 ч" },
  { show: "Молодёжный прайм", date: "Пн, 22 апр", progress: 45, duration: "2 ч" },
  { show: "Ночной эфир", date: "Вс, 21 апр", progress: 100, duration: "6 ч" },
  { show: "Культурный час", date: "Сб, 20 апр", progress: 100, duration: "2 ч" },
];

const FAVORITES = [
  { name: "Утреннее шоу", host: "Алексей Морозов", time: "09:00", days: "Пн–Пт" },
  { name: "Молодёжный прайм", host: "Катя Нова", time: "16:00", days: "Ежедневно" },
  { name: "Культурный час", host: "Нина Арт", time: "14:00", days: "Вт, Чт" },
];

const NOTIFICATIONS = [
  { text: "«Утреннее шоу» начнётся через 10 минут", time: "08:50", read: false },
  { text: "Новый эпизод «Вечернего джема» уже в эфире!", time: "19:01", read: false },
  { text: "«Культурный час» начинается", time: "14:00", read: true },
  { text: "Вы слушали 5 часов на этой неделе 🎉", time: "Вт", read: true },
];

type Tab = "history" | "favorites" | "notifications";

const AccountPage = () => {
  const [tab, setTab] = useState<Tab>("history");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen px-4 pt-8 flex flex-col">
        <div className="mb-8 animate-fade-up">
          <p className="text-xs font-body text-muted-foreground uppercase tracking-widest mb-1">Личный кабинет</p>
          <h1 className="font-display text-3xl font-semibold text-foreground">АККАУНТ</h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center pb-20 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF6B2B] to-[#8B5CF6] flex items-center justify-center mb-6 glow-orange">
            <Icon name="Radio" size={36} className="text-white" />
          </div>

          <h2 className="font-display text-2xl font-semibold text-foreground mb-2 text-center">ВОЙДИ В АККАУНТ</h2>
          <p className="font-body text-sm text-muted-foreground text-center mb-8 max-w-xs">
            Сохраняй прогресс прослушивания, подписывайся на любимые передачи и получай уведомления
          </p>

          <div className="w-full max-w-sm space-y-3">
            <div className="glass rounded-2xl px-4 py-1 flex items-center gap-3">
              <Icon name="Mail" size={16} className="text-muted-foreground flex-shrink-0" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 bg-transparent font-body text-sm text-foreground placeholder:text-muted-foreground outline-none py-3"
              />
            </div>

            <div className="glass rounded-2xl px-4 py-1 flex items-center gap-3">
              <Icon name="Lock" size={16} className="text-muted-foreground flex-shrink-0" />
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="flex-1 bg-transparent font-body text-sm text-foreground placeholder:text-muted-foreground outline-none py-3"
              />
            </div>

            <button
              onClick={() => setIsLoggedIn(true)}
              className="w-full py-4 rounded-2xl font-display text-sm font-semibold tracking-wider text-white transition-all hover:scale-[1.02] animate-glow-pulse"
              style={{ background: "linear-gradient(135deg, #FF6B2B, #8B5CF6)" }}
            >
              ВОЙТИ
            </button>

            <button className="w-full py-4 rounded-2xl glass font-body text-sm text-muted-foreground hover:text-foreground transition-all">
              Создать аккаунт
            </button>

            <p className="text-center font-body text-xs text-muted-foreground">
              <button className="text-[#FF6B2B] hover:underline">Забыли пароль?</button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fade-up">
        <div>
          <p className="text-xs font-body text-muted-foreground uppercase tracking-widest mb-1">Личный кабинет</p>
          <h1 className="font-display text-3xl font-semibold text-foreground">АККАУНТ</h1>
        </div>
        <button
          onClick={() => setIsLoggedIn(false)}
          className="glass rounded-xl p-2 hover:scale-105 transition-all"
        >
          <Icon name="LogOut" size={18} className="text-muted-foreground" />
        </button>
      </div>

      {/* Profile card */}
      <div className="glass rounded-3xl p-5 mb-6 flex items-center gap-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF6B2B] to-[#8B5CF6] flex items-center justify-center flex-shrink-0">
          <span className="font-display text-xl text-white font-bold">АМ</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-body font-semibold text-foreground">Алексей Морозов</p>
          <p className="font-body text-sm text-muted-foreground truncate">alexey@mail.ru</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-display text-2xl neon-orange font-semibold">47</p>
          <p className="font-body text-xs text-muted-foreground">часов</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6 animate-fade-up" style={{ animationDelay: "0.15s" }}>
        {[
          { label: "Передач", value: "23", icon: "Radio", color: "#FF6B2B" },
          { label: "Избранных", value: "3", icon: "Heart", color: "#8B5CF6" },
          { label: "Уведомлений", value: "7", icon: "Bell", color: "#14B8A6" },
        ].map((s, i) => (
          <div key={i} className="glass rounded-2xl p-4 flex flex-col items-center">
            <Icon name={s.icon as "Radio"} size={18} style={{ color: s.color }} className="mb-2" />
            <p className="font-display text-2xl font-semibold" style={{ color: s.color }}>{s.value}</p>
            <p className="font-body text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 animate-fade-up" style={{ animationDelay: "0.2s" }}>
        {([
          { key: "history", label: "История", icon: "Clock" },
          { key: "favorites", label: "Избранное", icon: "Heart" },
          { key: "notifications", label: "Уведомления", icon: "Bell" },
        ] as Array<{ key: Tab; label: string; icon: string }>).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-body text-sm transition-all flex-1 justify-center ${
              tab === t.key
                ? "bg-[#FF6B2B] text-white"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon name={t.icon as "Clock"} size={14} />
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="animate-fade-up" style={{ animationDelay: "0.25s" }}>
        {tab === "history" && (
          <div className="space-y-3">
            {HISTORY.map((item, i) => (
              <div key={i} className="glass rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-body text-sm font-medium text-foreground">{item.show}</p>
                    <p className="font-body text-xs text-muted-foreground">{item.date} · {item.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-sm font-semibold neon-orange">{item.progress}%</p>
                    {item.progress < 100 && (
                      <button className="font-body text-xs text-[#14B8A6] hover:underline">Продолжить</button>
                    )}
                  </div>
                </div>
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#FF6B2B] to-[#8B5CF6] transition-all"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "favorites" && (
          <div className="space-y-3">
            {FAVORITES.map((item, i) => (
              <div key={i} className="glass rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B2B]/20 to-[#8B5CF6]/20 flex items-center justify-center flex-shrink-0">
                  <Icon name="Heart" size={16} className="text-[#FF6B2B] fill-[#FF6B2B]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-medium text-foreground">{item.name}</p>
                  <p className="font-body text-xs text-muted-foreground">{item.host}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-display text-sm font-semibold text-foreground">{item.time}</p>
                  <p className="font-body text-xs text-muted-foreground">{item.days}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "notifications" && (
          <div className="space-y-2">
            {NOTIFICATIONS.map((n, i) => (
              <div
                key={i}
                className={`rounded-2xl p-4 flex gap-3 items-start ${
                  n.read ? "glass opacity-60" : "glass border border-[#8B5CF6]/20"
                }`}
              >
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.read ? "bg-muted-foreground" : "bg-[#8B5CF6]"}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm text-foreground">{n.text}</p>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="h-4" />
    </div>
  );
};

export default AccountPage;
