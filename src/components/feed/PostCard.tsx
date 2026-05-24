import { Link } from "@tanstack/react-router";
import { Flame } from "lucide-react";
import { motion } from "motion/react";
import { AnonAvatar } from "@/components/profile/AnonAvatar";
import { ReactionBar } from "./ReactionBar";
import { aliasFromSeed } from "@/lib/anon";
import { relativeTime } from "@/lib/format";
import type { Post } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Props = { post: Post; index?: number };

const tagColor: Record<NonNullable<Post["tag"]>, string> = {
  confession: "text-primary",
  opinion: "text-flame",
  question: "text-down",
  rant: "text-foreground",
};

export function PostCard({ post, index = 0 }: Props) {
  const alias = aliasFromSeed(post.authorSeed);
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1], delay: Math.min(index * 0.04, 0.2) }}
      className="group relative"
    >
      <Link
        to="/post/$id"
        params={{ id: post.id }}
        className="block rounded-xl bg-card p-4 ring-1 ring-border transition-colors hover:ring-border-strong"
      >
        <header className="flex items-center gap-2.5 text-[13px] text-muted-foreground">
          <AnonAvatar seed={post.authorSeed} size={28} />
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="truncate font-medium text-foreground/90">{alias}</span>
            <span className="text-muted-foreground/60">·</span>
            <span className="truncate">{post.community}</span>
            <span className="text-muted-foreground/60">·</span>
            <span className="shrink-0 tabular-nums">{relativeTime(post.createdAt)}</span>
          </div>
          {post.trending && (
            <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-flame/10 px-2 py-0.5 text-[11px] font-medium text-flame ring-1 ring-flame/25">
              <Flame className="h-3 w-3" />
              Trending
            </span>
          )}
        </header>

        <h2 className="mt-3 text-[17px] font-semibold leading-snug tracking-[-0.01em] text-foreground text-pretty">
          {post.title}
        </h2>
        <p className="mt-1.5 line-clamp-3 text-[14.5px] leading-relaxed text-muted-foreground text-pretty">
          {post.body}
        </p>

        {post.tag && (
          <div className="mt-3">
            <span className={cn("text-[11px] font-semibold uppercase tracking-[0.12em]", tagColor[post.tag])}>
              · {post.tag}
            </span>
          </div>
        )}

        <div className="mt-3">
          <ReactionBar
            initialScore={post.upvotes - post.downvotes}
            comments={post.comments}
            reposts={post.reposts}
          />
        </div>
      </Link>
    </motion.article>
  );
}
