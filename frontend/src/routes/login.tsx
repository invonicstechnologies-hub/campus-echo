import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, KeyRound } from "lucide-react";
import { useSendOtpAuthSendOtpPost, useVerifyOtpAuthVerifyOtpPost } from "../api/generated/auth/auth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Unsaid" }] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");

  const sendOtpMutation = useSendOtpAuthSendOtpPost();
  const verifyOtpMutation = useVerifyOtpAuthVerifyOtpPost();

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    sendOtpMutation.mutate(
      { data: { email } },
      { onSuccess: () => setStep("otp") }
    );
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    verifyOtpMutation.mutate(
      { data: { email, otp } },
      { onSuccess: () => nav({ to: "/feed" }) }
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-background px-6 pt-[10vh] pb-10">
      <Link to="/" className="font-serif text-[24px] leading-none">
        Unsaid<span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-primary align-middle" />
      </Link>
      <div className="mt-12 mb-8">
        <h1 className="font-serif text-[34px] leading-tight tracking-[-0.02em]">Welcome back.</h1>
        <p className="mt-2 text-[14px] text-muted-foreground">Sign in with your campus email.</p>
      </div>

      {step === "email" ? (
        <form onSubmit={handleSendOtp} className="flex flex-col gap-3">
          <Field label="Campus email" value={email} onChange={setEmail} type="email" placeholder="you@school.edu" disabled={sendOtpMutation.isPending} />
          
          {sendOtpMutation.isError && (
             <p className="text-xs text-destructive">Failed to send code. Please try again.</p>
          )}

          <button 
            disabled={sendOtpMutation.isPending}
            className="mt-3 flex items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-[15px] font-semibold text-primary-foreground shadow-pop tap hover:brightness-110 disabled:opacity-50"
          >
            {sendOtpMutation.isPending ? "Sending code..." : "Continue"} <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-3">
          <Field label="6-Digit Code" value={otp} onChange={setOtp} type="text" placeholder="000000" disabled={verifyOtpMutation.isPending} />
          
          {verifyOtpMutation.isError && (
             <p className="text-xs text-destructive">Invalid or expired code.</p>
          )}

          <button 
            disabled={verifyOtpMutation.isPending}
            className="mt-3 flex items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-[15px] font-semibold text-primary-foreground shadow-pop tap hover:brightness-110 disabled:opacity-50"
          >
            {verifyOtpMutation.isPending ? "Verifying..." : "Sign in"} <KeyRound className="h-4 w-4" />
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-[13px] text-muted-foreground">
        New here? <Link to="/register" className="font-medium text-foreground hover:text-primary">Create an account</Link>
      </p>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, disabled }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; disabled?: boolean;
}) {
  return (
    <label className="group flex flex-col gap-1.5">
      <span className="text-[12px] font-medium text-muted-foreground">{label}</span>
      <input
        value={value} onChange={(e) => onChange(e.target.value)} type={type} placeholder={placeholder} disabled={disabled}
        className="w-full rounded-md bg-secondary px-3.5 py-3 text-[15px] text-foreground placeholder:text-muted-foreground/60 outline-none ring-1 ring-border focus:ring-2 focus:ring-ring transition-shadow disabled:opacity-50"
      />
    </label>
  );
}
