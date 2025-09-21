import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Proposal {
  phase: string;
  date: string;
  milestone: string;
  notes: string;
}

const proposals: Proposal[] = [
  { phase: "Phase 1", date: "Week 1", milestone: "Discovery & Scope", notes: "Audit requirements, define KPIs, and align stakeholders." },
  { phase: "Phase 2", date: "Week 2", milestone: "Design System", notes: "Create atomic components, tokens, and interaction patterns." },
  { phase: "Phase 3", date: "Week 3-4", milestone: "MVP Build", notes: "Implement core flows with CI/CD and observability." },
  { phase: "Phase 4", date: "Week 5", milestone: "AI Integrations", notes: "Wire Gemini, vector search, and inference orchestration." },
  { phase: "Phase 5", date: "Week 6", milestone: "Hardening & Launch", notes: "Perf pass, a11y, security review, and cutover plan." },
];

export default function SmartTimeline() {
  const finalize = () => {
    toast.success("AI proposal finalized", { description: "Your roadmap is confirmed. You can still edit anytime." });
  };

  return (
    <section className="w-full py-10 sm:py-14 bg-[#0b0f1a] text-white">
      <div className="container">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Smart Planning Timeline</h2>
        <p className="mt-1 text-sm sm:text-base text-white/70">Quantum-Forge AI has generated a proposed roadmap. Review, customize, and finalize it.</p>

        {/* timeline */}
        <div className="mt-6">
          {/* desktop: horizontal */}
          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 bg-gradient-to-r from-cyan-500/40 via-violet-500/40 to-emerald-500/40" />
              <ul className="relative grid grid-cols-5 gap-6">
                {proposals.map((p, i) => (
                  <li key={i} className="group relative">
                    <div className="mx-auto size-4 rounded-full bg-white/10 ring-2 ring-cyan-400/60 group-hover:shadow-[0_0_0_6px_rgba(56,189,248,0.25)] transition" />
                    <div className="mt-3 rounded-xl bg-white/5 border border-white/10 p-4 backdrop-blur hover:bg-white/7.5 transition">
                      <div className="text-xs text-cyan-300/90">{p.phase} • {p.date}</div>
                      <div className="mt-1 font-semibold text-[15px]">{p.milestone}</div>
                      <div className="mt-1 text-sm text-white/70"><span className="text-cyan-300/90 mr-1">AI tip:</span>{p.notes}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* mobile: stacked */}
          <div className="md:hidden grid gap-3">
            {proposals.map((p, i) => (
              <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-xs text-cyan-300/90">
                  <div className="size-2 rounded-full bg-cyan-400/80 shadow-[0_0_12px_rgba(56,189,248,0.6)]" />
                  {p.phase} • {p.date}
                </div>
                <div className="mt-1 font-semibold">{p.milestone}</div>
                <div className="mt-1 text-sm text-white/70">{p.notes}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={finalize}
            className={cn(
              "relative inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold",
              "bg-gradient-to-r from-sky-500 to-violet-500 text-white",
              "shadow-[0_0_30px_rgba(99,102,241,0.45)] hover:shadow-[0_0_40px_rgba(56,189,248,0.55)]",
              "transition active:scale-95"
            )}
          >
            Finalize Plan
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
}
