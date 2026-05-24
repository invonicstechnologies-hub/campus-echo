import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { AnonAvatar } from "@/components/profile/AnonAvatar";
import { ReactionBar } from "@/components/feed/ReactionBar";
import { aliasFromSeed } from "@/lib/anon";
import { relativeTime } from "@/lib/format";
import type { Comment } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Node = Comment & { children: Node[] };

function buildTree(comments: Comment[]): Node[] {
  const map = new Map<string, Node>();
  comments.forEach(c => map.set(c.id, { ...c, children: [] }));
  const roots: Node[] = [];
  map.forEach(n => {
    if (n.parentId && map.has(n.parentId)) map.get(n.parentId)!.children.push(n);
    else roots.push(n);
  });
  return roots;
}

export function CommentThread({ comments }: { comments: Comment[] }) {
  const tree = useMemo(() => buildTree(comments), [comments]);
  return (
    <div className="flex flex-col gap-3">
      {tree.map(n => <CommentItem key={n.id} node={n} depth={0} />)}
    </div>
  );
}

function CommentItem({ node, depth }: { node: Node; depth: number }) {
  const [collapsed, setCollapsed] = useState(false);
  const alias = aliasFromSeed(node.authorSeed);

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
      className={cn("relative", depth > 0 && "pl-4")}
    >
      {depth > 0 && (
        <span className="pointer-events-none absolute left-0 top-0 h-full w-px bg-border" />
      )}
      <div className="flex gap-2.5">
        <AnonAvatar seed={node.authorSeed} size={26} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[12.5px] text-muted-foreground">
            <span className="font-medium text-foreground/90">{alias}</span>
            <span className="text-muted-foreground/60">·</span>
            <span className="tabular-nums">{relativeTime(node.ageMinutes)}</span>
            <button
              onClick={() => setCollapsed(v => !v)}
              className="ml-auto grid h-6 w-6 place-items-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground tap"
              aria-label={collapsed ? "Expand" : "Collapse"}
            >
              {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
          </div>
          {!collapsed && (
            <>
              <p className="mt-1 text-[14.5px] leading-relaxed text-foreground/90 text-pretty">{node.body}</p>
              <div className="mt-2">
                <ReactionBar initialScore={node.upvotes} comments={node.children.length} reposts={0} compact />
              </div>
              {node.children.length > 0 && (
                <div className="mt-3 flex flex-col gap-3">
                  {node.children.map(c => <CommentItem key={c.id} node={c} depth={depth + 1} />)}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
