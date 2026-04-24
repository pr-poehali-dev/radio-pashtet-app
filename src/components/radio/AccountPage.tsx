import { useState } from "react";
import Icon from "@/components/ui/icon";

type Tab = "history" | "favorites" | "notifications";
type Screen = "login" | "register" | "forgot";

interface Notification {
  id: number;
  text: string;
  time: string;
  read: boolean;
}

const AccountPage = ({ onGoLive }: { onGoLive?: () => void }) => {
  const [screen, setScreen] = useState<Screen>("login");
  const [tab, setTab] = useState<Tab>("history");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Форма входа
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Форма регистрации
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState(false);

  // Форма восстановления
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  // Данные пользователя после входа
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // Уведомления
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, text: "Добро пожаловать в Радио Паштет!", time: "Сейчас", read: false },
    { id: 2, text: "Новый эпизод уже в эфире!", time: "19:01", read: false },
    { id: 3, text: "Следи за расписанием — скоро новые передачи", time: "Вчера", read: true },
  ]);

  const handleLogin = () => {
    if (!email.trim()) { setLoginError("Введите email"); return; }
    if (!password.trim()) { setLoginError("Введите пароль"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setLoginError("Некорректный email"); return; }
    setLoginError("");
    const name = email.split("@")[0];
    setUserName(name.charAt(0).toUpperCase() + name.slice(1));
    setUserEmail(email);
    setIsLoggedIn(true);
  };

  const handleRegister = () => {
    if (!regName.trim()) { setRegError("Введите имя"); return; }
    if (!regEmail.trim()) { setRegError("Введите email"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail)) { setRegError("Некорректный email"); return; }
    if (regPassword.length < 6) { setRegError("Пароль минимум 6 символов"); return; }
    setRegError("");
    setRegSuccess(true);
    setTimeout(() => {
      setUserName(regName);
      setUserEmail(regEmail);
      setIsLoggedIn(true);
    }, 1500);
  };

  const handleForgot = () => {
    if (!forgotEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      return;
    }
    setForgotSent(true);
  };

  const initials = userName
    ? userName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const markRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // ── ЭКРАН ВХОДА ──────────────────────────────────────────────
  if (!isLoggedIn && screen === "login") {
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
            <div className={`glass rounded-2xl px-4 py-1 flex items-center gap-3 ${loginError && !email ? "border border-red-500/50" : ""}`}>
              <Icon name="Mail" size={16} className="text-muted-foreground flex-shrink-0" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => { setEmail(e.target.value); setLoginError(""); }}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                className="flex-1 bg-transparent font-body text-sm text-foreground placeholder:text-muted-foreground outline-none py-3"
              />
            </div>

            <div className={`glass rounded-2xl px-4 py-1 flex items-center gap-3 ${loginError && !password ? "border border-red-500/50" : ""}`}>
              <Icon name="Lock" size={16} className="text-muted-foreground flex-shrink-0" />
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={e => { setPassword(e.target.value); setLoginError(""); }}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                className="flex-1 bg-transparent font-body text-sm text-foreground placeholder:text-muted-foreground outline-none py-3"
              />
            </div>

            {loginError && (
              <p className="font-body text-xs text-red-400 px-1 animate-fade-up">{loginError}</p>
            )}

            <button
              onClick={handleLogin}
              className="w-full py-4 rounded-2xl font-display text-sm font-semibold tracking-wider text-white transition-all hover:scale-[1.02] animate-glow-pulse"
              style={{ background: "linear-gradient(135deg, #FF6B2B, #8B5CF6)" }}
            >
              ВОЙТИ
            </button>

            <button
              onClick={() => { setScreen("register"); setLoginError(""); }}
              className="w-full py-4 rounded-2xl glass font-body text-sm text-muted-foreground hover:text-foreground transition-all"
            >
              Создать аккаунт
            </button>

            <p className="text-center font-body text-xs text-muted-foreground">
              <button
                onClick={() => { setScreen("forgot"); setLoginError(""); }}
                className="text-[#FF6B2B] hover:underline"
              >
                Забыли пароль?
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── ЭКРАН РЕГИСТРАЦИИ ─────────────────────────────────────────
  if (!isLoggedIn && screen === "register") {
    return (
      <div className="min-h-screen px-4 pt-8 flex flex-col">
        <div className="mb-8 animate-fade-up flex items-center gap-3">
          <button onClick={() => setScreen("login")} className="glass p-2 rounded-xl hover:scale-105 transition-all">
            <Icon name="ArrowLeft" size={18} className="text-muted-foreground" />
          </button>
          <div>
            <p className="text-xs font-body text-muted-foreground uppercase tracking-widest mb-0.5">Новый пользователь</p>
            <h1 className="font-display text-2xl font-semibold text-foreground">РЕГИСТРАЦИЯ</h1>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center pb-20 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          {regSuccess ? (
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#14B8A6] to-[#8B5CF6] flex items-center justify-center mx-auto mb-4 glow-teal">
                <Icon name="CheckCircle" size={36} className="text-white" />
              </div>
              <p className="font-display text-xl text-foreground">АККАУНТ СОЗДАН!</p>
              <p className="font-body text-sm text-muted-foreground mt-2">Входим...</p>
            </div>
          ) : (
            <div className="w-full max-w-sm space-y-3">
              <div className={`glass rounded-2xl px-4 py-1 flex items-center gap-3 ${regError.includes("имя") ? "border border-red-500/50" : ""}`}>
                <Icon name="User" size={16} className="text-muted-foreground flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Ваше имя"
                  value={regName}
                  onChange={e => { setRegName(e.target.value); setRegError(""); }}
                  className="flex-1 bg-transparent font-body text-sm text-foreground placeholder:text-muted-foreground outline-none py-3"
                />
              </div>

              <div className={`glass rounded-2xl px-4 py-1 flex items-center gap-3 ${regError.includes("email") ? "border border-red-500/50" : ""}`}>
                <Icon name="Mail" size={16} className="text-muted-foreground flex-shrink-0" />
                <input
                  type="email"
                  placeholder="Email"
                  value={regEmail}
                  onChange={e => { setRegEmail(e.target.value); setRegError(""); }}
                  className="flex-1 bg-transparent font-body text-sm text-foreground placeholder:text-muted-foreground outline-none py-3"
                />
              </div>

              <div className={`glass rounded-2xl px-4 py-1 flex items-center gap-3 ${regError.includes("Пароль") ? "border border-red-500/50" : ""}`}>
                <Icon name="Lock" size={16} className="text-muted-foreground flex-shrink-0" />
                <input
                  type="password"
                  placeholder="Пароль (минимум 6 символов)"
                  value={regPassword}
                  onChange={e => { setRegPassword(e.target.value); setRegError(""); }}
                  onKeyDown={e => e.key === "Enter" && handleRegister()}
                  className="flex-1 bg-transparent font-body text-sm text-foreground placeholder:text-muted-foreground outline-none py-3"
                />
              </div>

              {regError && (
                <p className="font-body text-xs text-red-400 px-1 animate-fade-up">{regError}</p>
              )}

              <button
                onClick={handleRegister}
                className="w-full py-4 rounded-2xl font-display text-sm font-semibold tracking-wider text-white transition-all hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, #14B8A6, #8B5CF6)" }}
              >
                СОЗДАТЬ АККАУНТ
              </button>

              <button onClick={() => setScreen("login")} className="w-full py-3 font-body text-sm text-muted-foreground hover:text-foreground transition-all text-center">
                Уже есть аккаунт? Войти
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── ЭКРАН ВОССТАНОВЛЕНИЯ ──────────────────────────────────────
  if (!isLoggedIn && screen === "forgot") {
    return (
      <div className="min-h-screen px-4 pt-8 flex flex-col">
        <div className="mb-8 animate-fade-up flex items-center gap-3">
          <button onClick={() => setScreen("login")} className="glass p-2 rounded-xl hover:scale-105 transition-all">
            <Icon name="ArrowLeft" size={18} className="text-muted-foreground" />
          </button>
          <div>
            <p className="text-xs font-body text-muted-foreground uppercase tracking-widest mb-0.5">Восстановление</p>
            <h1 className="font-display text-2xl font-semibold text-foreground">ЗАБЫЛИ ПАРОЛЬ?</h1>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center pb-20 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          {forgotSent ? (
            <div className="text-center max-w-xs">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF6B2B] to-[#F59E0B] flex items-center justify-center mx-auto mb-4">
                <Icon name="MailCheck" size={36} className="text-white" />
              </div>
              <p className="font-display text-xl text-foreground mb-2">ПИСЬМО ОТПРАВЛЕНО</p>
              <p className="font-body text-sm text-muted-foreground mb-6">Проверь почту {forgotEmail} — там ссылка для сброса пароля</p>
              <button
                onClick={() => { setScreen("login"); setForgotSent(false); setForgotEmail(""); }}
                className="font-body text-sm text-[#FF6B2B] hover:underline"
              >
                Вернуться к входу
              </button>
            </div>
          ) : (
            <div className="w-full max-w-sm space-y-3">
              <p className="font-body text-sm text-muted-foreground text-center mb-4">
                Введи email — пришлём ссылку для сброса пароля
              </p>
              <div className="glass rounded-2xl px-4 py-1 flex items-center gap-3">
                <Icon name="Mail" size={16} className="text-muted-foreground flex-shrink-0" />
                <input
                  type="email"
                  placeholder="Email"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleForgot()}
                  className="flex-1 bg-transparent font-body text-sm text-foreground placeholder:text-muted-foreground outline-none py-3"
                />
              </div>
              <button
                onClick={handleForgot}
                disabled={!forgotEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)}
                className="w-full py-4 rounded-2xl font-display text-sm font-semibold tracking-wider text-white transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #FF6B2B, #8B5CF6)" }}
              >
                ОТПРАВИТЬ ССЫЛКУ
              </button>
              <button onClick={() => setScreen("login")} className="w-full py-3 font-body text-sm text-muted-foreground hover:text-foreground transition-all text-center">
                Вернуться к входу
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── ЛИЧНЫЙ КАБИНЕТ ────────────────────────────────────────────
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen px-4 pt-8">
      {/* Подтверждение выхода */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
          <div className="glass rounded-3xl p-6 w-full max-w-sm border border-white/10 animate-fade-up">
            <h3 className="font-display text-xl text-foreground mb-2 text-center">ВЫЙТИ ИЗ АККАУНТА?</h3>
            <p className="font-body text-sm text-muted-foreground text-center mb-6">Твой прогресс сохранится</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 rounded-2xl glass font-body text-sm text-muted-foreground hover:text-foreground transition-all"
              >
                Отмена
              </button>
              <button
                onClick={() => { setIsLoggedIn(false); setShowLogoutConfirm(false); setEmail(""); setPassword(""); setScreen("login"); }}
                className="flex-1 py-3 rounded-2xl font-body text-sm font-semibold text-white transition-all"
                style={{ background: "linear-gradient(135deg, #FF6B2B, #E85D20)" }}
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fade-up">
        <div>
          <p className="text-xs font-body text-muted-foreground uppercase tracking-widest mb-1">Личный кабинет</p>
          <h1 className="font-display text-3xl font-semibold text-foreground">АККАУНТ</h1>
        </div>
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="glass rounded-xl p-2 hover:scale-105 transition-all"
          title="Выйти"
        >
          <Icon name="LogOut" size={18} className="text-muted-foreground" />
        </button>
      </div>

      {/* Profile card */}
      <div className="glass rounded-3xl p-5 mb-6 flex items-center gap-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF6B2B] to-[#8B5CF6] flex items-center justify-center flex-shrink-0">
          <span className="font-display text-xl text-white font-bold">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-body font-semibold text-foreground">{userName}</p>
          <p className="font-body text-sm text-muted-foreground truncate">{userEmail}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-display text-2xl neon-orange font-semibold">0</p>
          <p className="font-body text-xs text-muted-foreground">часов</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6 animate-fade-up" style={{ animationDelay: "0.15s" }}>
        {[
          { label: "Передач", value: "0", icon: "Radio", color: "#FF6B2B" },
          { label: "Избранных", value: "0", icon: "Heart", color: "#8B5CF6" },
          { label: "Уведомлений", value: String(unreadCount), icon: "Bell", color: "#14B8A6" },
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
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-body text-sm transition-all flex-1 justify-center relative ${
              tab === t.key ? "bg-[#FF6B2B] text-white" : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon name={t.icon as "Clock"} size={14} />
            <span className="hidden sm:inline">{t.label}</span>
            {t.key === "notifications" && unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#8B5CF6] text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="animate-fade-up" style={{ animationDelay: "0.25s" }}>
        {tab === "history" && (
          <div className="glass rounded-3xl p-6 flex flex-col items-center text-center">
            <Icon name="Clock" size={32} className="text-muted-foreground mb-3" />
            <p className="font-display text-lg text-foreground mb-1">ИСТОРИЯ ПУСТА</p>
            <p className="font-body text-sm text-muted-foreground mb-4">Включи радио — и история прослушивания появится здесь</p>
            <button
              onClick={onGoLive}
              className="px-6 py-3 rounded-2xl font-display text-sm font-semibold tracking-wide text-white transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #FF6B2B, #E85D20)" }}
            >
              СЛУШАТЬ ЭФИР
            </button>
          </div>
        )}

        {tab === "favorites" && (
          <div className="glass rounded-3xl p-6 flex flex-col items-center text-center">
            <Icon name="Heart" size={32} className="text-muted-foreground mb-3" />
            <p className="font-display text-lg text-foreground mb-1">НЕТ ИЗБРАННОГО</p>
            <p className="font-body text-sm text-muted-foreground mb-4">Нажми ❤️ на странице эфира — передача появится здесь</p>
            <button
              onClick={onGoLive}
              className="px-6 py-3 rounded-2xl font-display text-sm font-semibold tracking-wide text-white transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #8B5CF6, #6366F1)" }}
            >
              ПЕРЕЙТИ В ЭФИР
            </button>
          </div>
        )}

        {tab === "notifications" && (
          <div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="w-full mb-3 py-2.5 glass rounded-2xl font-body text-sm text-muted-foreground hover:text-foreground transition-all"
              >
                Отметить все как прочитанные
              </button>
            )}
            <div className="space-y-2">
              {notifications.map(n => (
                <button
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`w-full rounded-2xl p-4 flex gap-3 items-start text-left transition-all hover:border-white/10 ${
                    n.read ? "glass opacity-60" : "glass border border-[#8B5CF6]/20"
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 transition-colors ${n.read ? "bg-muted-foreground" : "bg-[#8B5CF6]"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm text-foreground">{n.text}</p>
                    <p className="font-body text-xs text-muted-foreground mt-0.5">{n.time}</p>
                  </div>
                  {!n.read && <span className="font-body text-xs text-[#8B5CF6] flex-shrink-0 mt-0.5">Новое</span>}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="h-4" />
    </div>
  );
};

export default AccountPage;
