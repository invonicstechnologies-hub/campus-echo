import { cn } from "@/lib/utils";
import { gradientFromSeed, initialsFromAlias, aliasFromSeed } from "@/lib/anon";

type Props = {
  seed: string;
  size?: number;
  className?: string;
  showInitials?: boolean;
};

export function AnonAvatar({ seed, size = 36, className, showInitials = true }: Props) {
  const alias = aliasFromSeed(seed);
  const initials = initialsFromAlias(alias);
  return (
    <div
      className={cn(
        "relative shrink-0 rounded-full ring-1 ring-white/10 flex items-center justify-center font-medium text-white/90 select-none",
        className,
      )}
      style={{
        width: size,
        height: size,
        background: gradientFromSeed(seed),
        fontSize: Math.max(10, Math.floor(size * 0.36)),
        letterSpacing: "-0.02em",
      }}
      aria-hidden={!showInitials}
    >
      {showInitials ? initials : null}
    </div>
  );
}
