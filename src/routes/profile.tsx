import { createFileRoute, Link } from "@tanstack/react-router";
import { Settings, Shield } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { AnonAvatar } from "@/components/profile/AnonAvatar";
import { PostCard } from "@/components/feed/PostCard";
import { me, posts } from "@/lib/mock-data";
import { compactNumber } from "@/lib/format";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "You — Unsaid" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const yourPosts = posts.slice(0, 3); // mocked
  return (
    <AppShell>
      <section className="rounded-xl bg-card p-5 ring-1 ring-border">
        <div className="flex items-center gap-4">
          <AnonAvatar seed={me.seed} size={64} />
          <div className="min-w-0 flex-1">
            <h1 className="font-serif text-[26px] leading-none">{me.alias}</h1>
            <p className="mt-1.5 text-[12px] text-muted-foreground">
              Anonymous identity · only you can see this name.
            </p>
          </div>
          <button className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-muted-foreground ring-1 ring-border tap hover:text-foreground" aria-label="Settings">
            <Settings className="h-[18px] w-[18px]" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <Stat label="Karma" value={compactNumber(me.karma)} />
          <Stat label="Posts" value={String(me.posts)} />
          <Stat label="Replies" value={String(me.comments)} />
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-lg bg-secondary/50 p-2.5 text-[12px] text-muted-foreground ring-1 ring-border">
          <Shield className="h-3.5 w-3.5 shrink-0 text-primary" />
          Your real identity is never stored. Aliases rotate when you want them to.
        </div>
      </section>

      <div className="mt-6 mb-3 flex items-center justify-between">
        <h2 className="text-[15px] font-semibold tracking-[-0.01em]">Your recent posts</h2>
        <Link to="/feed" className="text-[12px] font-medium text-muted-foreground hover:text-foreground">See all</Link>
      </div>
      <div className="flex flex-col gap-2.5">
        {yourPosts.map((p, i) => <PostCard key={p.id} post={p} index={i} />)}
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-secondary/60 p-3 text-center ring-1 ring-border">
      <div className="text-[18px] font-semibold tracking-[-0.01em] tabular-nums">{value}</div>
      <div className="mt-0.5 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{label}</div>
    </div>
  );
}
