import Icon from "@/components/ui/icon";
import type { Page } from "@/pages/Index";

interface BottomNavProps {
  activePage: Page;
  setActivePage: (p: Page) => void;
}

const TABS: Array<{ key: Page; label: string; icon: string }> = [
  { key: "live", label: "Эфир", icon: "Radio" },
  { key: "schedule", label: "Расписание", icon: "CalendarDays" },
  { key: "account", label: "Аккаунт", icon: "User" },
];

const BottomNav = ({ activePage, setActivePage }: BottomNavProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2">
      <div className="glass rounded-3xl flex items-center justify-around p-2 mx-auto max-w-sm border border-white/10">
        {TABS.map(tab => {
          const isActive = activePage === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActivePage(tab.key)}
              className={`flex flex-col items-center gap-1 py-2 px-5 rounded-2xl transition-all ${
                isActive
                  ? "bg-[#FF6B2B] text-white scale-105"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon name={tab.icon as "Radio"} size={20} />
              <span className="font-body text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
