import { toast } from "sonner";

interface Node {
  phase: string; // e.g., Day 1
  label: string; // suggestion
  notes: string; // quick tips
}

const nodes: Node[] = [
  { phase: "Day 1", label: "Explore Old Goa", notes: "Basilica, Se Cathedral, and Latin Quarter walk." },
  { phase: "Day 2", label: "North Beaches", notes: "Fort Aguada → Sinquerim → Baga sunset." },
  { phase: "Day 3", label: "Dudhsagar / Spice Farm", notes: "Morning trek or jeep safari; book slots early." },
  { phase: "Day 4", label: "Food + Nightlife", notes: "Panjim cafés by day, Anjuna night market." },
  { phase: "Day 5", label: "Leisure & Departure", notes: "Beach brunch, souvenirs, return to BLR." },
];

export default function TravelTimeline() {
  const finalize = () => {
    toast.success("Plan finalized", { description: "Agentic AI itinerary confirmed. You can still tweak anytime." });
  };

  return (
    <section className="container py-10 sm:py-14">
      <h2 className="text-2xl sm:text-3xl font-bold">Smart Planning Timeline</h2>
      <p className="mt-1 text-sm sm:text-base text-foreground/75">Agentic AI generates and updates your travel roadmap.</p>

      <div className="mt-6">
        {/* Desktop: Horizontal timeline */}
        <div className="hidden md:block">
          <div className="relative">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-cyan-400/40 via-violet-400/40 to-emerald-400/40" />
            <ul className="relative grid grid-cols-5 gap-6">
              {nodes.map((n, i) => (
                <li key={i} className="group">
                  <div className="mx-auto size-4 rounded-full bg-white/30 ring-2 ring-cyan-300/70 shadow-[0_0_18px_rgba(56,189,248,0.5)] group-hover:shadow-[0_0_26px_rgba(124,58,237,0.6)] transition" />
                  <div className="mt-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur p-4 hover:bg-white/15 transition">
                    <div className="text-xs text-cyan-600 dark:text-cyan-300">{n.phase}</div>
                    <div className="mt-1 font-semibold text-sm">{n.label}</div>
                    <div className="mt-1 text-xs text-foreground/80"><span className="text-violet-500 dark:text-violet-300 mr-1">AI:</span>{n.notes}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mobile: stacked */}
        <div className="md:hidden grid gap-3">
          {nodes.map((n, i) => (
            <div key={i} className="rounded-xl border border-white/20 bg-white/10 backdrop-blur p-4">
              <div className="flex items-center gap-2 text-xs text-cyan-600 dark:text-cyan-300">
                <span className="size-2 rounded-full bg-cyan-400/80 shadow-[0_0_10px_rgba(56,189,248,0.7)]" />
                {n.phase}
              </div>
              <div className="mt-1 font-semibold text-sm">{n.label}</div>
              <div className="mt-1 text-xs text-foreground/80"><span className="text-violet-500 dark:text-violet-300 mr-1">AI:</span>{n.notes}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={finalize}
          className="relative inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-violet-500 shadow-[0_0_30px_rgba(99,102,241,0.45)] hover:shadow-[0_0_40px_rgba(56,189,248,0.55)] transition active:scale-95"
        >
          Finalize Plan ✨
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </section>
  );
}
