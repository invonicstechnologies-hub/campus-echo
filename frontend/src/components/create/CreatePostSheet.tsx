import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Globe2, EyeOff, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { communities, me } from "@/lib/mock-data";
import { AnonAvatar } from "@/components/profile/AnonAvatar";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const MAX = 480;

export function CreatePostSheet({ open, onOpenChange }: Props) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [community, setCommunity] = useState(communities[0].slug);
  const [anon] = useState(true);
  const remaining = MAX - body.length;
  const ringPct = Math.min(1, body.length / MAX);

  const close = () => onOpenChange(false);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-xl rounded-t-2xl bg-popover ring-1 ring-border shadow-pop sm:bottom-auto sm:top-[12vh] sm:rounded-2xl"
            role="dialog" aria-modal="true" aria-label="Create post"
          >
            <div className="mx-auto mt-2 h-1 w-9 rounded-full bg-border sm:hidden" />
            <header className="flex items-center justify-between px-4 pt-3 pb-2">
              <button onClick={close} className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:bg-accent tap" aria-label="Close">
                <X className="h-[18px] w-[18px]" />
              </button>
              <span className="text-[13px] font-medium text-muted-foreground">New post</span>
              <button
                disabled={!title.trim()}
                onClick={close}
                className={cn(
                  "rounded-full bg-primary px-4 py-1.5 text-[13px] font-semibold text-primary-foreground tap",
                  !title.trim() && "opacity-40",
                )}
              >
                Post
              </button>
            </header>

            <div className="flex items-center gap-2 px-4 pb-3">
              <AnonAvatar seed={me.seed} size={28} />
              <span className="text-[13px] font-medium">{me.alias}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground ring-1 ring-border">
                {anon ? <EyeOff className="h-3 w-3" /> : <Globe2 className="h-3 w-3" />}
                {anon ? "Anonymous" : "Public"}
              </span>
              <button className="ml-auto inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[12px] font-medium ring-1 ring-border tap">
                <span className="text-muted-foreground">in</span>
                <span>{communities.find(c => c.slug === community)?.name}</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                <select
                  value={community}
                  onChange={(e) => setCommunity(e.target.value)}
                  className="absolute inset-0 opacity-0"
                  aria-label="Community"
                >
                  {communities.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </button>
            </div>

            <div className="px-4">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Say the thing."
                className="w-full bg-transparent text-[20px] font-semibold tracking-[-0.01em] text-foreground placeholder:text-muted-foreground/60 outline-none"
                autoFocus
              />
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value.slice(0, MAX))}
                placeholder="No names. No filters. Just you, but quieter."
                rows={6}
                className="mt-2 w-full resize-none bg-transparent text-[15px] leading-relaxed text-foreground/90 placeholder:text-muted-foreground/60 outline-none"
              />
            </div>

            <footer className="flex items-center justify-between px-4 py-3">
              <span className="text-[12px] text-muted-foreground">
                {anon ? "Your identity stays hidden." : "Posting publicly."}
              </span>
              <div className="relative grid h-7 w-7 place-items-center">
                <svg viewBox="0 0 24 24" className="h-7 w-7 -rotate-90">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" className="text-border" strokeWidth="2" fill="none" />
                  <circle
                    cx="12" cy="12" r="10"
                    stroke="currentColor"
                    className={cn(remaining < 40 ? "text-primary" : "text-foreground/70")}
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray={2 * Math.PI * 10}
                    strokeDashoffset={2 * Math.PI * 10 * (1 - ringPct)}
                    strokeLinecap="round"
                  />
                </svg>
                {remaining < 60 && (
                  <span className="absolute text-[9px] tabular-nums font-semibold">{remaining}</span>
                )}
              </div>
            </footer>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
