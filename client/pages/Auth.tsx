import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden width={18} height={18} {...props}>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.3 6.3 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.1-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.3 6.3 29.4 4 24 4 16.1 4 9.2 8.6 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.3 0 10.2-2 13.8-5.2l-6.4-5.2C29.4 35.7 26.8 37 24 37c-5.2 0-9.6-3.3-11.2-7.8l-6.6 5.1C9.1 39.3 16 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1 2.9-3.1 5.3-5.9 6.5l6.4 5.2C39.1 36.6 44 30.9 44 24c0-1.2-.1-2.1-.4-3.5z"/>
    </svg>
  );
}

export default function Auth() {
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp, signInWithProvider, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate("/");
  }, [loading, user, navigate]);

  const onGoogle = async () => {
    try {
      setSubmitting(true);
      const user = await signInWithProvider("google");
      toast.success("Signed in", { description: `Welcome, ${user.name}` });
      navigate("/");
    } catch (e: any) {
      toast.error("Sign in failed", { description: e?.message || String(e) });
    } finally {
      setSubmitting(false);
    }
  };

  const onContinue = async () => {
    const email = form.email.trim();
    const password = form.password;
    const name = form.name.trim();
    if (!email || !password || (mode === "signup" && !name)) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      setSubmitting(true);
      if (mode === "signup") {
        const user = await signUp({ name, email, password });
        toast.success("Account created", { description: `Welcome, ${user.name}` });
      } else {
        const user = await signIn({ email, password });
        toast.success("Signed in", { description: `Welcome back, ${user.name}` });
      }
      navigate("/");
    } catch (e: any) {
      toast.error(mode === "signup" ? "Sign up failed" : "Sign in failed", { description: e?.message || String(e) });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-dvh grid place-items-center overflow-hidden">
      {/* animated gradient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-sky-500/40 to-violet-500/40 blur-3xl animate-float" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-violet-500/40 to-emerald-400/40 blur-3xl animate-float [animation-delay:800ms]" />
      </div>

      <div className="w-full max-w-md px-4">
        <div className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl p-6 sm:p-8 text-center animate-fade-up">
          <h1 className="text-2xl sm:text-3xl font-extrabold">Welcome to WanderWise AI</h1>
          <p className="mt-1 text-sm text-foreground/80">Your Intelligent Travel Companion</p>

          <div className="mt-5 grid gap-3">
            <button
              onClick={onGoogle}
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 w-full rounded-full px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-violet-500 hover:brightness-110 active:scale-95 transition disabled:opacity-60"
            >
              <GoogleIcon /> Continue with Google
            </button>
          </div>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/20" />
            <span className="text-xs text-foreground/70">or continue manually</span>
            <div className="h-px flex-1 bg-white/20" />
          </div>

          <form className="grid gap-3 text-left" onSubmit={(e) => { e.preventDefault(); onContinue(); }}>
            {mode === "signup" && (
              <div>
                <label className="text-xs text-foreground/70">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Jane Doe"
                  autoComplete="name"
                  className="mt-1 w-full rounded-xl border border-white/25 bg-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            )}
            <div>
              <label className="text-xs text-foreground/70">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                autoComplete="email"
                className="mt-1 w-full rounded-xl border border-white/25 bg-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="text-xs text-foreground/70">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                className="mt-1 w-full rounded-xl border border-white/25 bg-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <button type="submit" disabled={submitting} className="mt-1 inline-flex items-center justify-center w-full rounded-full px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-brand-muted to-brand-pastel hover:brightness-110 active:scale-95 transition disabled:opacity-60">
              {submitting ? (mode === "signup" ? "Creating account..." : "Signing in...") : "Continue"}
            </button>
          </form>

          <div className="mt-4 text-xs text-foreground/80">
            {mode === "signup" ? (
              <p>
                Already have an account? {" "}
                <button className="underline underline-offset-4 hover:text-primary" onClick={() => setMode("signin")}>Sign In</button>
              </p>
            ) : (
              <p>
                New here? {" "}
                <button className="underline underline-offset-4 hover:text-primary" onClick={() => setMode("signup")}>Create an account</button>
              </p>
            )}
            <p className="mt-2 text-[11px] leading-relaxed text-foreground/70">
              By continuing, you agree to our <span className="underline">Terms & Conditions</span> and <span className="underline">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
