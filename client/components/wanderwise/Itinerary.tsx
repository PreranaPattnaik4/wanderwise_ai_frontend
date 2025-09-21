type Activity = { name: string; cost: number; duration: string };
interface DayPlan {
  day: number;
  destination: string;
  activities: Activity[];
  hiddenGem?: string;
}

const sample: DayPlan[] = [
  {
    day: 1,
    destination: "Bangalore → Goa",
    activities: [
      { name: "Flight/Train to Goa", cost: 60, duration: "1.5–10h" },
      { name: "Check-in & Beach Sunset (Baga/Calangute)", cost: 0, duration: "2h" },
    ],
    hiddenGem: "Try local poisson recheado at a family-run eatery. ✨",
  },
  {
    day: 2,
    destination: "Goa — North Beaches",
    activities: [
      { name: "Fort Aguada & Sinquerim", cost: 2, duration: "3h" },
      { name: "Night Market & Live Music", cost: 20, duration: "3h" },
    ],
  },
  {
    day: 3,
    destination: "Goa — Old Goa Heritage",
    activities: [
      { name: "Basilica of Bom Jesus & Se Cathedral", cost: 1, duration: "3h" },
      { name: "Panjim Latin Quarter Walk", cost: 0, duration: "2h" },
    ],
  },
  {
    day: 4,
    destination: "Goa — Adventure",
    activities: [
      { name: "Dudhsagar Falls/Spice Plantation", cost: 35, duration: "5h" },
      { name: "Water Sports (Candolim)", cost: 40, duration: "2h" },
    ],
  },
  {
    day: 5,
    destination: "Goa — Leisure & Departure",
    activities: [
      { name: "Beach Brunch & Souvenirs", cost: 15, duration: "2h" },
      { name: "Return to Bangalore", cost: 60, duration: "1.5–10h" },
    ],
  },
];

export default function Itinerary() {
  const budget = { total: 2000, percentUsed: 5 };
  const spent = sample
    .flatMap((d) => d.activities)
    .reduce((acc, a) => acc + a.cost, 0);
  const percent = budget.percentUsed;

  return (
    <section className="container py-10 sm:py-14" id="itinerary">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-2xl sm:text-3xl font-bold">Your Itinerary</h2>
        <div className="hidden sm:flex items-center gap-2 text-sm">
          <span className="px-2 py-1 rounded bg-brand-beige/80">On track ✅</span>
          <span className="text-foreground/70">Budget {percent}% used</span>
        </div>
      </div>

      <div className="mb-5">
        <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-brand-muted to-brand-pastel" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <div className="grid gap-6">
        {sample.map((d) => (
          <article key={d.day} className="relative rounded-2xl border border-border bg-card/60 overflow-hidden shadow-sm animate-slide-in">
            <div className="absolute left-4 top-4 size-3 rounded-full bg-brand-pastel animate-glow" />
            <div className="grid md:grid-cols-2">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Day {d.day}: {d.destination}</h3>
                  {d.hiddenGem && (
                    <span className="text-xs px-2 py-1 rounded-full bg-brand-pastel/30 border border-brand-pastel">Hidden Gem ✨</span>
                  )}
                </div>
                <ul className="mt-4 space-y-2">
                  {d.activities.map((a, i) => (
                    <li key={i} className="flex items-center justify-between text-sm">
                      <span className="text-foreground/90">{a.name}</span>
                      <span className="text-foreground/70">💰 ${a.cost} • {a.duration}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="rounded-full px-3 py-2 text-xs font-medium bg-brand-beige/70 hover:brightness-105 transition">Book Hotel</button>
                  <button className="rounded-full px-3 py-2 text-xs font-medium bg-brand-beige/70 hover:brightness-105 transition">View Map</button>
                  <button className="rounded-full px-3 py-2 text-xs font-medium bg-brand-beige/70 hover:brightness-105 transition">Optimize Budget</button>
                </div>
              </div>

              <div className="min-h-[220px] bg-muted/40">
                <iframe
                  title={`Map for ${d.destination}`}
                  loading="lazy"
                  className="w-full h-full min-h-[220px]"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(d.destination)}&output=embed`}
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="px-4 py-2 text-xs text-foreground/70 bg-background/80">Markers: Popular Place • Must-Try Food • Local Events</div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 p-4">
        🌧 Rain detected — museum added instead of hike. The old plan fades, the new plan is highlighted.
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <button className="rounded-md border border-border bg-background px-3 py-2 text-sm hover:bg-brand-beige/60 transition">Hospitals Nearby</button>
        <button className="rounded-md border border-border bg-background px-3 py-2 text-sm hover:bg-brand-beige/60 transition">Embassies</button>
        <button className="rounded-md border border-border bg-background px-3 py-2 text-sm hover:bg-brand-beige/60 transition">Police Stations</button>
      </div>
    </section>
  );
}
