import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, EyeOff, MessageCircleMore, Flame } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Welcome — Unsaid" }] }),
  component: OnboardingPage,
});

const slides = [
  {
    icon: EyeOff,
    title: "Say it without saying it.",
    body: "Post anything to your campus, with no name attached. Just your voice — softer, freer, real.",
  },
  {
    icon: MessageCircleMore,
    title: "Conversations, not performances.",
    body: "No likes for clout, no profiles to maintain. Threads that actually feel like people talking.",
  },
  {
    icon: Flame,
    title: "Tap into what's loud right now.",
    body: "See what your campus is whispering about. Confessions, rants, late-night thoughts.",
  },
];

function OnboardingPage() {
  const [i, setI] = useState(0);
  const nav = useNavigate();
  const slide = slides[i];
  const Icon = slide.icon;

  const next = () => {
    if (i < slides.length - 1) setI(i + 1);
    else nav({ to: "/register" });
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-background px-6 pt-[10vh] pb-10">
      <header className="flex items-center justify-between">
        <span className="font-serif text-[24px] leading-none">Unsaid<span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-primary align-middle" /></span>
        <Link to="/login" className="text-[13px] font-medium text-muted-foreground hover:text-foreground tap">Sign in</Link>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
            className="flex flex-col items-center"
          >
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/30">
              <Icon className="h-6 w-6" />
            </div>
            <h1 className="mt-6 font-serif text-[40px] leading-[1.05] tracking-[-0.02em] text-balance">
              {slide.title}
            </h1>
            <p className="mt-4 max-w-[28ch] text-[15px] leading-relaxed text-muted-foreground text-pretty">
              {slide.body}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mb-6 flex justify-center gap-1.5">
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={
              "h-1.5 rounded-full transition-all duration-300 " +
              (idx === i ? "w-6 bg-foreground" : "w-1.5 bg-border")
            }
          />
        ))}
      </div>

      <button
        onClick={next}
        className="group flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-[15px] font-semibold text-primary-foreground shadow-pop tap hover:brightness-110"
      >
        {i < slides.length - 1 ? "Continue" : "Get started"}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </button>
      <Link to="/feed" className="mt-3 text-center text-[12.5px] text-muted-foreground hover:text-foreground tap">
        Browse anonymously first
      </Link>
    </div>
  );
}
