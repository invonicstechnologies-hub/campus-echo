import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { FeedTabs } from "@/components/feed/FeedTabs";
import { PostCard } from "@/components/feed/PostCard";
import { useGetPostsPostsGet } from "@/api/generated/posts/posts";
import { FeedSkeleton } from "@/components/feed/FeedSkeleton";

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
  const { data, isLoading } = useGetPostsPostsGet();

  const visible = useMemo(() => {
    if (!data?.posts) return [];
    const posts = data.posts;
    
    if (tab === "new") return [...posts].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    if (tab === "hot") return [...posts].sort((a, b) => b.upvote_count - a.upvote_count);
    return posts;
  }, [data, tab]);

  return (
    <AppLayout>
      <FeedTabs tabs={tabs} active={tab} onChange={setTab} />
      <div className="flex flex-col gap-2.5 mt-4">
        {isLoading ? (
          <FeedSkeleton />
        ) : (
          visible.map((p) => <PostCard key={p.id} post={p} />)
        )}
      </div>
    </AppLayout>
  );
}
