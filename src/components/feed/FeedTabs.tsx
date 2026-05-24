import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type Tab = { id: string; label: string };

type Props = {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
};

export function FeedTabs({ tabs, active, onChange }: Props) {
  return (
    <div className="sticky top-14 z-30 -mx-3 mb-2 px-3 sm:-mx-4 sm:px-4 glass">
      <div className="hairline flex items-center gap-1 py-2 overflow-x-auto no-scrollbar">
        {tabs.map((t) => {
          const isActive = t.id === active;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className={cn(
                "relative rounded-full px-3.5 py-1.5 text-[13px] font-medium tap whitespace-nowrap",
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="feedtabs-active"
                  className="absolute inset-0 -z-0 rounded-full bg-secondary ring-1 ring-border"
                  transition={{ type: "spring", stiffness: 500, damping: 36 }}
                />
              )}
              <span className="relative z-10">{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
