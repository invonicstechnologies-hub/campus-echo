import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Flag } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ReactionBar } from "@/components/feed/ReactionBar";
import { AnonAvatar } from "@/components/profile/AnonAvatar";
import { getPost, commentsFor } from "@/lib/mock-data";
import { aliasFromSeed } from "@/lib/anon";
import { relativeTime } from "@/lib/format";
import { CommentThread } from "@/components/post/CommentThread";
import { ReplyBar } from "@/components/post/ReplyBar";

export const Route = createFileRoute("/post/$id")({
  loader: ({ params }) => {
    const post = getPost(params.id);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.post.title.slice(0, 60)} — Unsaid` : "Post — Unsaid" },
      { name: "description", content: loaderData?.post.body.slice(0, 160) ?? "" },
    ],
  }),
  notFoundComponent: () => (
    <AppShell>
      <p className="py-20 text-center text-muted-foreground">This post couldn't be found.</p>
    </AppShell>
  ),
  errorComponent: ({ error, reset }) => (
    <AppShell>
      <p className="py-20 text-center text-muted-foreground">{error.message}</p>
      <button onClick={reset} className="mx-auto block rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Try again</button>
    </AppShell>
  ),
  component: PostDetail,
});

function PostDetail() {
  const { post } = Route.useLoaderData();
  const all = commentsFor(post.id);
  const alias = aliasFromSeed(post.authorSeed);

  return (
    <AppShell>
      <div className="-mt-1 mb-2 flex items-center gap-2">
        <Link to="/feed" className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground tap" aria-label="Back">
          <ArrowLeft className="h-[18px] w-[18px]" />
        </Link>
        <span className="text-[13px] text-muted-foreground">Back to feed</span>
        <button className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-[12px] text-muted-foreground ring-1 ring-border tap hover:text-foreground">
          <Flag className="h-3.5 w-3.5" />
          Report
        </button>
      </div>

      <article className="rounded-xl bg-card p-4 ring-1 ring-border">
        <header className="flex items-center gap-2.5 text-[13px] text-muted-foreground">
          <AnonAvatar seed={post.authorSeed} size={32} />
          <div className="flex min-w-0 flex-col">
            <span className="font-medium text-foreground/90">{alias}</span>
            <span>{post.community} · {relativeTime(post.ageMinutes)}</span>
          </div>
        </header>
        <h1 className="mt-3 text-[22px] font-semibold leading-tight tracking-[-0.015em] text-foreground text-pretty">
          {post.title}
        </h1>
        <p className="mt-2 whitespace-pre-line text-[15.5px] leading-relaxed text-foreground/90 text-pretty">
          {post.body}
        </p>
        <div className="mt-4">
          <ReactionBar
            initialScore={post.upvotes - post.downvotes}
            comments={post.comments}
            reposts={post.reposts}
          />
        </div>
      </article>

      <section className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold tracking-[-0.01em]">{post.comments} comments</h2>
          <button className="text-[12px] font-medium text-muted-foreground hover:text-foreground">Top ↓</button>
        </div>
        <CommentThread comments={all} />
      </section>

      <ReplyBar />
    </AppShell>
  );
}
