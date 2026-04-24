import { useState } from "react";
import Icon from "@/components/ui/icon";

const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const SCHEDULE: Record<number, Array<{
  time: string; title: string; host: string; duration: string; category: string; subscribed: boolean;
}>> = {
  0: [
    { time: "06:00", title: "Доброе утро", host: "Мария Светлова", duration: "2 ч", category: "Утреннее", subscribed: true },
    { time: "08:00", title: "Новости и музыка", host: "Павел Громов", duration: "1 ч", category: "Новости", subscribed: false },
    { time: "09:00", title: "Утреннее шоу", host: "Алексей Морозов", duration: "3 ч", category: "Шоу", subscribed: true },
    { time: "12:00", title: "Обеденный хит-парад", host: "Оля Звонова", duration: "2 ч", category: "Музыка", subscribed: false },
    { time: "14:00", title: "Дневные истории", host: "Сергей Лунин", duration: "2 ч", category: "Разговорное", subscribed: false },
    { time: "16:00", title: "Молодёжный прайм", host: "Катя Нова", duration: "2 ч", category: "Шоу", subscribed: true },
    { time: "18:00", title: "Вечерние новости", host: "Павел Громов", duration: "1 ч", category: "Новости", subscribed: false },
    { time: "19:00", title: "Вечерний джем", host: "Дима Блюз", duration: "3 ч", category: "Музыка", subscribed: false },
    { time: "22:00", title: "Ночной эфир", host: "Аня Тишина", duration: "6 ч", category: "Ночное", subscribed: false },
  ],
  1: [
    { time: "06:00", title: "Доброе утро", host: "Мария Светлова", duration: "2 ч", category: "Утреннее", subscribed: true },
    { time: "08:00", title: "Вторник с новостями", host: "Павел Громов", duration: "1 ч", category: "Новости", subscribed: false },
    { time: "09:00", title: "Утреннее шоу", host: "Алексей Морозов", duration: "3 ч", category: "Шоу", subscribed: true },
    { time: "12:00", title: "Рок-полдень", host: "Дима Кузнецов", duration: "2 ч", category: "Музыка", subscribed: false },
    { time: "14:00", title: "Культурный час", host: "Нина Арт", duration: "2 ч", category: "Культура", subscribed: true },
    { time: "16:00", title: "Молодёжный прайм", host: "Катя Нова", duration: "2 ч", category: "Шоу", subscribed: true },
    { time: "18:00", title: "Вечерние новости", host: "Павел Громов", duration: "1 ч", category: "Новости", subscribed: false },
    { time: "19:00", title: "Джазовый вечер", host: "Ирина Блюзова", duration: "3 ч", category: "Джаз", subscribed: false },
    { time: "22:00", title: "Ночной эфир", host: "Аня Тишина", duration: "6 ч", category: "Ночное", subscribed: false },
  ],
};

const CATEGORY_COLORS: Record<string, string> = {
  "Утреннее": "#FF6B2B",
  "Новости": "#8B5CF6",
  "Шоу": "#14B8A6",
  "Музыка": "#F59E0B",
  "Разговорное": "#EC4899",
  "Ночное": "#6366F1",
  "Культура": "#10B981",
  "Джаз": "#F59E0B",
};

const SchedulePage = () => {
  const [activeDay, setActiveDay] = useState(0);
  const [subscriptions, setSubscriptions] = useState<Record<string, boolean>>({});
  const today = new Date().getDay();
  const adjustedToday = today === 0 ? 6 : today - 1;

  const schedule = SCHEDULE[activeDay % 2] || SCHEDULE[0];

  const toggleSubscription = (key: string, defaultVal: boolean) => {
    setSubscriptions(prev => ({
      ...prev,
      [key]: key in prev ? !prev[key] : !defaultVal,
    }));
  };

  const isSubscribed = (key: string, defaultVal: boolean) =>
    key in subscriptions ? subscriptions[key] : defaultVal;

  return (
    <div className="min-h-screen px-4 pt-8">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <p className="text-xs font-body text-muted-foreground uppercase tracking-widest mb-1">Программа передач</p>
        <h1 className="font-display text-3xl font-semibold text-foreground">РАСПИСАНИЕ</h1>
      </div>

      {/* Days selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 animate-fade-up" style={{ animationDelay: "0.1s" }}>
        {DAYS.map((day, i) => (
          <button
            key={i}
            onClick={() => setActiveDay(i)}
            className={`flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-2xl transition-all ${
              activeDay === i
                ? "bg-[#FF6B2B] text-white glow-orange"
                : i === adjustedToday
                ? "glass border border-[#FF6B2B]/30 text-[#FF6B2B]"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="font-display text-xs font-medium">{day}</span>
            {i === adjustedToday && (
              <span className="w-1 h-1 rounded-full bg-current mt-1" />
            )}
          </button>
        ))}
      </div>

      {/* Notification info */}
      <div className="glass rounded-2xl px-4 py-3 mb-5 flex items-center gap-3 animate-fade-up" style={{ animationDelay: "0.15s" }}>
        <Icon name="Bell" size={16} className="text-[#8B5CF6]" />
        <p className="font-body text-xs text-muted-foreground">
          Нажми 🔔 рядом с передачей — получишь уведомление за 5 минут до начала
        </p>
      </div>

      {/* Schedule list */}
      <div className="space-y-3 animate-fade-up" style={{ animationDelay: "0.2s" }}>
        {schedule.map((item, i) => {
          const key = `${activeDay}-${i}`;
          const subbed = isSubscribed(key, item.subscribed);
          const color = CATEGORY_COLORS[item.category] || "#FF6B2B";

          return (
            <div
              key={i}
              className="glass rounded-2xl p-4 flex gap-4 hover:border-white/10 transition-all"
              style={{ borderLeft: `3px solid ${color}` }}
            >
              {/* Time */}
              <div className="flex-shrink-0 text-center pt-0.5">
                <p className="font-display text-lg font-semibold" style={{ color }}>{item.time}</p>
                <p className="font-body text-xs text-muted-foreground">{item.duration}</p>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-body text-sm font-semibold text-foreground truncate">{item.title}</p>
                    <p className="font-body text-xs text-muted-foreground mt-0.5">{item.host}</p>
                  </div>
                  <button
                    onClick={() => toggleSubscription(key, item.subscribed)}
                    className={`flex-shrink-0 p-2 rounded-xl transition-all hover:scale-110 ${
                      subbed ? "bg-[#8B5CF6]/20 text-[#8B5CF6]" : "glass text-muted-foreground"
                    }`}
                  >
                    <Icon name={subbed ? "BellRing" : "Bell"} size={15} />
                  </button>
                </div>
                <div className="mt-2">
                  <span
                    className="inline-block font-body text-xs px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${color}20`, color }}
                  >
                    {item.category}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="h-4" />
    </div>
  );
};

export default SchedulePage;
