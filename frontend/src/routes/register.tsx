import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Shield } from "lucide-react";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — Unsaid" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  return (
    <div className="flex min-h-screen flex-col bg-background px-6 pt-[10vh] pb-10">
      <Link to="/onboarding" className="font-serif text-[24px] leading-none">
        Unsaid<span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-primary align-middle" />
      </Link>
      <div className="mt-10 mb-6">
        <h1 className="font-serif text-[34px] leading-tight tracking-[-0.02em]">Make it yours,<br/>quietly.</h1>
        <p className="mt-2 text-[14px] text-muted-foreground">We only need your campus email to verify you're a student.</p>
      </div>

      <div className="mb-4 flex items-start gap-2 rounded-lg bg-primary/[0.06] p-3 text-[12.5px] text-foreground/80 ring-1 ring-primary/20">
        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <span>Your email is hashed. We never link it to anything you post.</span>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); nav({ to: "/feed" }); }} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-[12px] font-medium text-muted-foreground">Campus email</span>
          <input
            value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@school.edu"
            className="rounded-md bg-secondary px-3.5 py-3 text-[15px] outline-none ring-1 ring-border focus:ring-2 focus:ring-ring"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[12px] font-medium text-muted-foreground">Password</span>
          <input
            value={pw} onChange={(e) => setPw(e.target.value)} type="password" placeholder="At least 8 characters"
            className="rounded-md bg-secondary px-3.5 py-3 text-[15px] outline-none ring-1 ring-border focus:ring-2 focus:ring-ring"
          />
        </label>
        <button className="mt-3 flex items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-[15px] font-semibold text-primary-foreground shadow-pop tap hover:brightness-110">
          Create account <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <p className="mt-6 text-center text-[13px] text-muted-foreground">
        Already have one? <Link to="/login" className="font-medium text-foreground hover:text-primary">Sign in</Link>
      </p>
    </div>
  );
}
