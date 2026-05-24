import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Flame, Bell, User, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

type Item = { to: string; label: string; icon: typeof Home };

const items: Item[] = [
  { to: "/feed", label: "Feed", icon: Home },
  { to: "/trending", label: "Trending", icon: Flame },
  { to: "/notifications", label: "Alerts", icon: Bell },
  { to: "/profile", label: "You", icon: User },
];

type Props = { onCreate: () => void };

export function BottomNav({ onCreate }: Props) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 glass pb-[max(env(safe-area-inset-bottom),8px)] pt-2"
      aria-label="Primary"
    >
      <div className="hairline absolute inset-x-0 top-0 h-px" />
      <div className="mx-auto grid max-w-md grid-cols-5 items-center px-4">
        {items.slice(0, 2).map((it) => (
          <NavItem key={it.to} item={it} active={pathname.startsWith(it.to)} />
        ))}

        <div className="flex items-center justify-center">
          <button
            onClick={onCreate}
            aria-label="Create post"
            className="relative grid h-12 w-12 -translate-y-3 place-items-center rounded-full bg-primary text-primary-foreground shadow-pop tap hover:brightness-110"
          >
            <Plus className="h-5 w-5" strokeWidth={2.5} />
            <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/10" />
          </button>
        </div>

        {items.slice(2).map((it) => (
          <NavItem key={it.to} item={it} active={pathname.startsWith(it.to)} />
        ))}
      </div>
    </nav>
  );
}

function NavItem({ item, active }: { item: Item; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      className={cn(
        "relative flex h-12 flex-col items-center justify-center gap-0.5 text-[10px] font-medium tap",
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {active && (
        <motion.span
          layoutId="bottom-active"
          className="absolute -top-2 h-1 w-1 rounded-full bg-primary"
          transition={{ type: "spring", stiffness: 500, damping: 32 }}
        />
      )}
      <Icon className="h-[20px] w-[20px]" strokeWidth={active ? 2.4 : 1.8} />
      <span className="tracking-wide">{item.label}</span>
    </Link>
  );
}
