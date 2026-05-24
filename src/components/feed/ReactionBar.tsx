import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowBigUp, ArrowBigDown, MessageCircle, Repeat2, Share, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { compactNumber } from "@/lib/format";

type ActionState = "up" | "down" | null;

type Props = {
  initialScore: number;
  comments: number;
  reposts: number;
  compact?: boolean;
};

export function ReactionBar({ initialScore, comments, reposts, compact }: Props) {
  const [vote, setVote] = useState<ActionState>(null);
  const [reposted, setReposted] = useState(false);

  const adjust = (target: ActionState) => {
    if (target === "up") return vote === "up" ? -1 : vote === "down" ? 2 : 1;
    if (target === "down") return vote === "down" ? 1 : vote === "up" ? -2 : -1;
    return 0;
  };

  const score = initialScore + (vote === "up" ? 1 : vote === "down" ? -1 : 0);

  const onVote = (target: Exclude<ActionState, null>) => {
    setVote((v) => (v === target ? null : target));
    void adjust;
  };

  return (
    <div className={cn("flex items-center gap-1.5 text-muted-foreground", compact && "text-[13px]")}>
      <div
        className={cn(
          "flex items-center rounded-full bg-secondary/60 ring-1 ring-border tap",
          vote === "up" && "bg-primary/10 ring-primary/30 text-primary",
          vote === "down" && "bg-down/10 ring-down/30 text-down",
        )}
      >
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onVote("up"); }}
          aria-label="Upvote"
          className="grid h-8 w-8 place-items-center rounded-full hover:text-primary"
        >
          <ArrowBigUp className={cn("h-[18px] w-[18px]", vote === "up" && "fill-current")} />
        </button>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={score}
            initial={{ y: vote === "up" ? 10 : -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: vote === "up" ? -10 : 10, opacity: 0 }}
            transition={{ type: "spring", stiffness: 600, damping: 30 }}
            className={cn("min-w-[28px] text-center text-[13px] font-semibold tabular-nums", !vote && "text-foreground/85")}
          >
            {compactNumber(score)}
          </motion.span>
        </AnimatePresence>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onVote("down"); }}
          aria-label="Downvote"
          className="grid h-8 w-8 place-items-center rounded-full hover:text-down"
        >
          <ArrowBigDown className={cn("h-[18px] w-[18px]", vote === "down" && "fill-current")} />
        </button>
      </div>

      <PillButton icon={MessageCircle} label={compactNumber(comments)} />
      <PillButton
        icon={Repeat2}
        label={compactNumber(reposts + (reposted ? 1 : 0))}
        active={reposted}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setReposted(v => !v); }}
        activeClass="bg-flame/10 ring-flame/30 text-flame"
      />
      <PillButton icon={Share} />
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        aria-label="More"
        className="ml-auto grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground tap"
      >
        <MoreHorizontal className="h-[18px] w-[18px]" />
      </button>
    </div>
  );
}

function PillButton({
  icon: Icon, label, active, onClick, activeClass,
}: {
  icon: typeof MessageCircle;
  label?: string;
  active?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  activeClass?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex h-8 items-center gap-1.5 rounded-full bg-secondary/60 px-2.5 ring-1 ring-border tap hover:text-foreground",
        active && activeClass,
      )}
    >
      <Icon className="h-[16px] w-[16px]" />
      {label && <span className="text-[13px] font-semibold tabular-nums">{label}</span>}
    </button>
  );
}
