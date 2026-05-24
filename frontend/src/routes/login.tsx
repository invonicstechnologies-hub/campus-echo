import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Unsaid" }] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  return (
    <div className="flex min-h-screen flex-col bg-background px-6 pt-[10vh] pb-10">
      <Link to="/onboarding" className="font-serif text-[24px] leading-none">
        Unsaid<span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-primary align-middle" />
      </Link>
      <div className="mt-12 mb-8">
        <h1 className="font-serif text-[34px] leading-tight tracking-[-0.02em]">Welcome back.</h1>
        <p className="mt-2 text-[14px] text-muted-foreground">Sign in with your campus email.</p>
      </div>
      <form
        onSubmit={(e) => { e.preventDefault(); nav({ to: "/feed" }); }}
        className="flex flex-col gap-3"
      >
        <Field label="Campus email" value={email} onChange={setEmail} type="email" placeholder="you@school.edu" />
        <Field label="Password" value={pw} onChange={setPw} type="password" placeholder="••••••••" />

        <button className="mt-3 flex items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-[15px] font-semibold text-primary-foreground shadow-pop tap hover:brightness-110">
          Sign in <ArrowRight className="h-4 w-4" />
        </button>
      </form>
      <p className="mt-6 text-center text-[13px] text-muted-foreground">
        New here? <Link to="/register" className="font-medium text-foreground hover:text-primary">Create an account</Link>
      </p>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <label className="group flex flex-col gap-1.5">
      <span className="text-[12px] font-medium text-muted-foreground">{label}</span>
      <input
        value={value} onChange={(e) => onChange(e.target.value)} type={type} placeholder={placeholder}
        className="w-full rounded-md bg-secondary px-3.5 py-3 text-[15px] text-foreground placeholder:text-muted-foreground/60 outline-none ring-1 ring-border focus:ring-2 focus:ring-ring transition-shadow"
      />
    </label>
  );
}
