import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { FeedTabs } from "@/components/feed/FeedTabs";
import { PostCard } from "@/components/feed/PostCard";
import { posts } from "@/lib/mock-data";

export const Route = createFileRoute("/feed")({
  head: () => ({
    meta: [
      { title: "Feed — Unsaid" },
      { name: "description", content: "What campus is actually saying, anonymously." },
    ],
  }),
  component: FeedPage,
});

const tabs = [
  { id: "hot", label: "Hot" },
  { id: "new", label: "New" },
  { id: "trending", label: "Trending" },
  { id: "confessions", label: "Confessions" },
  { id: "rants", label: "Rants" },
];

function FeedPage() {
  const [tab, setTab] = useState("hot");
  const visible = useMemo(() => {
    if (tab === "new") return [...posts].sort((a, b) => b.createdAt - a.createdAt);
    if (tab === "trending") return posts.filter(p => p.trending);
    if (tab === "confessions") return posts.filter(p => p.community === "confessions");
    if (tab === "rants") return posts.filter(p => p.community === "rants");
    return [...posts].sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
  }, [tab]);

  return (
    <AppShell>
      <FeedTabs tabs={tabs} active={tab} onChange={setTab} />
      <div className="flex flex-col gap-2.5">
        {visible.map((p, i) => <PostCard key={p.id} post={p} index={i} />)}
      </div>
    </AppShell>
  );
}
