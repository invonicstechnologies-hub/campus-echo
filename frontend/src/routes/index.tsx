import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Ghost, ShieldAlert, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Unsaid — Spill it safely." }] }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background px-6 pt-[8vh] pb-10 selection:bg-primary/30">
      {/* Header Logo */}
      <div className="flex w-full items-center justify-between max-w-md mx-auto">
        <div className="font-serif text-[24px] leading-none text-foreground">
          Unsaid<span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-primary align-middle" />
        </div>
      </div>

      <main className="mt-[12vh] flex flex-col items-start max-w-md mx-auto w-full">
        <div className="inline-flex items-center gap-2 rounded-full bg-secondary/80 px-3 py-1 text-xs font-medium text-primary ring-1 ring-border mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          <span>The campus, unfiltered.</span>
        </div>

        <h1 className="font-serif text-[44px] leading-[1.05] tracking-[-0.02em] text-foreground mb-5">
          Say what you <br /> really mean.
        </h1>
        
        <p className="text-[15px] leading-relaxed text-muted-foreground mb-8">
          A zero-knowledge anonymous space strictly for campus students. Post the things you wouldn't say out loud. No names, no tracking, strictly vibes.
        </p>

        <div className="flex w-full flex-col gap-3">
          <Link 
            to="/register" 
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-[15px] font-semibold text-primary-foreground shadow-pop tap hover:brightness-110 transition-all"
          >
            Join the conversation <ArrowRight className="h-4 w-4" />
          </Link>
          <Link 
            to="/login" 
            className="flex w-full items-center justify-center gap-2 rounded-full bg-secondary py-3.5 text-[15px] font-semibold text-foreground ring-1 ring-border tap hover:bg-secondary/80 transition-all"
          >
            I already have an account
          </Link>
        </div>

        <div className="mt-14 w-full space-y-7 border-t border-border/50 pt-8">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Ghost className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-[14.5px] font-semibold text-foreground">100% Anonymous</h3>
              <p className="mt-1 text-[13.5px] text-muted-foreground leading-relaxed">
                Your identity is cryptographically severed from your posts. We literally couldn't dox you if we tried.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <ShieldAlert className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-[14.5px] font-semibold text-foreground">Campus Only</h3>
              <p className="mt-1 text-[13.5px] text-muted-foreground leading-relaxed">
                Gated by university email. No outsiders, no bots, just the real ground.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
