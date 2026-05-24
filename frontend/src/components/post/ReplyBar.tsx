import { useState } from "react";
import { Send, Smile } from "lucide-react";
import { cn } from "@/lib/utils";

export function ReplyBar() {
  const [value, setValue] = useState("");
  return (
    <div className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+56px)] z-30 px-3">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-2 rounded-full bg-popover/90 p-1.5 pl-4 ring-1 ring-border shadow-pop backdrop-blur">
          <Smile className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Add a quiet thought…"
            className="min-w-0 flex-1 bg-transparent py-2 text-[14px] text-foreground placeholder:text-muted-foreground/70 outline-none"
          />
          <button
            disabled={!value.trim()}
            className={cn(
              "grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground tap",
              !value.trim() && "opacity-40",
            )}
            aria-label="Send reply"
          >
            <Send className="h-[16px] w-[16px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
