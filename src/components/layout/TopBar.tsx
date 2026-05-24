import { Link, useRouterState } from "@tanstack/react-router";
import { Search, Bell } from "lucide-react";
import { AnonAvatar } from "@/components/profile/AnonAvatar";
import { me } from "@/lib/mock-data";

export function TopBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onFeed = pathname === "/feed" || pathname === "/";

  return (
    <header className="sticky top-0 z-40 glass">
      <div className="mx-auto flex h-14 max-w-2xl items-center gap-3 px-4 hairline">
        <Link to="/feed" className="flex items-center gap-1.5 tap">
          <span className="font-serif text-[26px] leading-none text-foreground">Unsaid</span>
          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
        </Link>

        <div className="flex-1" />

        <button
          aria-label="Search"
          className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:text-foreground hover:bg-accent tap"
        >
          <Search className="h-[18px] w-[18px]" />
        </button>
        <Link
          to="/notifications"
          aria-label="Notifications"
          className="relative grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:text-foreground hover:bg-accent tap"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
        </Link>
        <Link to="/profile" aria-label="Profile" className="tap">
          <AnonAvatar seed={me.seed} size={32} />
        </Link>
      </div>
      {onFeed ? null : null}
    </header>
  );
}
