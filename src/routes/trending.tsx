import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PostCard } from "@/components/feed/PostCard";
import { posts } from "@/lib/mock-data";
import { Flame } from "lucide-react";

export const Route = createFileRoute("/trending")({
  head: () => ({ meta: [{ title: "Trending — Unsaid" }] }),
  component: TrendingPage,
});

function TrendingPage() {
  const trending = posts.filter(p => p.trending).sort((a, b) => b.upvotes - a.upvotes);
  return (
    <AppShell>
      <div className="mb-3 flex items-center gap-2 px-1">
        <Flame className="h-5 w-5 text-flame" />
        <h1 className="font-serif text-[28px] leading-tight">Trending</h1>
      </div>
      <p className="mb-4 px-1 text-[13px] text-muted-foreground">
        What everyone on campus is whispering about right now.
      </p>
      <div className="flex flex-col gap-2.5">
        {trending.map((p, i) => <PostCard key={p.id} post={p} index={i} />)}
      </div>
    </AppShell>
  );
}
