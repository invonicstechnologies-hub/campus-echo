import { Link, useLocation } from '@tanstack/react-router';
import { Home, Search, PenSquare, User, Megaphone } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Search', path: '/search', icon: Search },
    { name: 'Post', path: '/post', icon: PenSquare },
    { name: 'Petitions', path: '/petitions', icon: Megaphone },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-6 border-b border-border">
        <h1 className="text-xl font-bold tracking-tight text-primary">Campus Echo</h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground",
                isActive && "bg-accent text-accent-foreground font-medium"
              )}
            >
              <item.icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-base">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <div className="text-xs text-center text-muted-foreground">
          Zero-knowledge campus speech
        </div>
      </div>
    </aside>
  );
}
