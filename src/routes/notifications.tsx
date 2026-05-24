import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { AnonAvatar } from "@/components/profile/AnonAvatar";
import { notifications, getPost } from "@/lib/mock-data";
import { aliasFromSeed } from "@/lib/anon";
import { relativeTime } from "@/lib/format";
import { MessageCircle, ArrowBigUp, Repeat2, AtSign } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Alerts — Unsaid" }] }),
  component: NotificationsPage,
});

const iconFor = {
  reply: MessageCircle,
  upvote: ArrowBigUp,
  repost: Repeat2,
  mention: AtSign,
} as const;

function NotificationsPage() {
  return (
    <AppShell>
      <h1 className="mb-3 px-1 font-serif text-[28px] leading-tight">Alerts</h1>
      <div className="rounded-xl bg-card ring-1 ring-border">
        {notifications.map((n, i) => {
          const Icon = iconFor[n.kind];
          const post = getPost(n.postId);
          return (
            <Link
              to="/post/$id"
              params={{ id: n.postId }}
              key={n.id}
              className={cn(
                "flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-accent/40",
                i !== notifications.length - 1 && "hairline",
                !n.read && "bg-primary/[0.04]",
              )}
            >
              <div className="relative">
                <AnonAvatar seed={n.authorSeed} size={36} />
                <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground ring-2 ring-card">
                  <Icon className="h-3 w-3" />
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] leading-snug">
                  <span className="font-medium">{aliasFromSeed(n.authorSeed)}</span>
                  <span className="text-muted-foreground"> {n.preview}</span>
                </p>
                {post && (
                  <p className="mt-0.5 line-clamp-1 text-[12px] text-muted-foreground">on "{post.title}"</p>
                )}
              </div>
              <span className="shrink-0 text-[11px] text-muted-foreground tabular-nums">{relativeTime(n.ageMinutes)}</span>
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}
