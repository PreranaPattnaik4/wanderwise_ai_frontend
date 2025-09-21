import { MouseEvent } from "react";

export default function Hero() {
  const onClick = (e: MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("onboarding");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    // Also update the hash to ensure navigation works even if smooth scroll is blocked
    if (location.hash !== "#onboarding") location.hash = "#onboarding";
  };

  return (
    <section className="relative">
      <div
        className="relative h-[68dvh] sm:h-[72dvh] w-full overflow-hidden rounded-b-3xl"
      >
        <img
          src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=1600&auto=format&fit=crop"
          alt="Scenic travel"
          className="absolute inset-0 size-full object-cover"
          style={{ filter: "blur(1.5px) saturate(1.05)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/40 to-background" />
        <div className="relative z-10 h-full container flex flex-col items-start justify-center gap-4 animate-fade-up">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight max-w-[18ch]">
            Plan Your Perfect Trip with AI Assistance.
          </h1>
          <p className="text-base sm:text-lg text-foreground/90 max-w-[60ch]">
            Interactive itineraries, voice chat, live updates, and bookings in one place.
            <br />
            With Google’s Agentic AI and Gemini, WanderWise transforms aspirations into unforgettable adventures.
          </p>
          <div className="pt-1">
            <a
              href="#onboarding"
              onClick={onClick}
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 bg-gradient-to-r from-brand-muted to-brand-pastel hover:brightness-105 active:scale-95 transition"
            >
              Start Planning
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
