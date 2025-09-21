import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { SlidersHorizontal } from "lucide-react";

const interests = [
  { key: "adventure", label: "Adventure", icon: "🏔" },
  { key: "heritage", label: "Heritage", icon: "🏛" },
  { key: "food", label: "Food", icon: "🍲" },
  { key: "nightlife", label: "Nightlife", icon: "🎶" },
  { key: "activities", label: "Activities", icon: "🎯" },
  { key: "office", label: "Office Tour", icon: "🏢" },
] as const;

type InterestKey = typeof interests[number]["key"];

const interestOptions: Record<InterestKey, string[]> = {
  adventure: ["Hiking", "Water sports", "Road trips", "Safari"],
  heritage: ["Museums", "Temples", "Historic walks", "Architecture"],
  food: ["Street food", "Fine dining", "Cafes", "Local markets"],
  nightlife: ["Clubs", "Bars", "Live music", "Rooftops"],
  activities: ["Spa", "Shopping", "Photography", "Workshops"],
  office: ["Meet the team", "Workspace tour", "Tech talk", "Cafeteria lunch", "Commute guidance"],
};

import TripPlanner from "@/components/wanderwise/TripPlanner";

export default function Onboarding() {
  const [budget, setBudget] = useState(1500);
  const [days, setDays] = useState(5);
  const [prefs, setPrefs] = useState<Record<string, boolean>>({ food: true, heritage: true, adventure: false, nightlife: false, office: false, activities: false });
  const [interestChoices, setInterestChoices] = useState<Record<InterestKey, Record<string, boolean>>>(() => {
    const init: Record<InterestKey, Record<string, boolean>> = {
      adventure: {}, heritage: {}, food: {}, nightlife: {}, activities: {}, office: {},
    } as any;
    (Object.keys(interestOptions) as InterestKey[]).forEach((k) => {
      init[k] = Object.fromEntries(interestOptions[k].map((o) => [o, false]));
    });
    return init;
  });
  const [language, setLanguage] = useState("English");
  const [diet, setDiet] = useState("No preference");

  return (
    <section id="onboarding" className="container py-10 sm:py-14">
      <div className="grid gap-6">
        <h2 className="text-2xl sm:text-3xl font-bold">Tell us about your trip</h2>
        <TripPlanner />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border p-4 bg-card/50">
            <label className="text-sm font-medium">Budget ($)</label>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="range"
                min={200}
                max={10000}
                value={budget}
                onChange={(e) => setBudget(parseInt(e.target.value))}
                className="w-full accent-[hsl(var(--brand-muted))]"
              />
              <div className="px-2 py-1 rounded-md bg-brand-beige/50 text-sm">{budget}</div>
            </div>
          </div>
          <div className="rounded-xl border border-border p-4 bg-card/50">
            <label className="text-sm font-medium">Trip Duration (days)</label>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={30}
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                className="w-full accent-[hsl(var(--brand-pastel))]"
              />
              <div className="px-2 py-1 rounded-md bg-brand-beige/50 text-sm">{days}d</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border p-4 bg-card/50">
          <p className="text-sm font-medium mb-3">Interests</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {interests.map((i) => {
              const active = !!(prefs as any)[i.key];
              const selectedCount = Object.values(interestChoices[i.key] || {}).filter(Boolean).length;
              return (
                <div
                  key={i.key}
                  className={
                    "rounded-lg border border-border p-3 transition hover:shadow " +
                    (active ? "bg-brand-pastel/20 ring-1 ring-brand-pastel" : "bg-background")
                  }
                >
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => setPrefs((p) => ({ ...p, [i.key]: !p[i.key] }))}
                      className="inline-flex items-center gap-2 text-left"
                    >
                      <span className="text-xl" aria-hidden>{i.icon}</span>
                      <span className="text-sm font-medium">{i.label}</span>
                    </button>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          className="size-7 grid place-items-center rounded-md border border-border hover:bg-muted/60"
                          aria-label={`${i.label} options`}
                        >
                          <SlidersHorizontal className="size-4" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent align="end">
                        <div className="text-xs font-semibold mb-2">{i.label} options</div>
                        <div className="grid gap-2">
                          {interestOptions[i.key].map((opt) => (
                            <label key={opt} className="flex items-center gap-2 text-sm">
                              <Checkbox
                                checked={!!interestChoices[i.key]?.[opt]}
                                onCheckedChange={(v) =>
                                  setInterestChoices((prev) => ({
                                    ...prev,
                                    [i.key]: { ...prev[i.key], [opt]: !!v },
                                  }))
                                }
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="mt-1 text-xs text-foreground/70">
                    {active ? (selectedCount ? `${selectedCount} selected` : "Selected") : "Tap to select"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border p-4 bg-card/50">
            <label className="text-sm font-medium">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="mt-2 w-full rounded-md border border-border bg-background p-2 hover:border-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-muted"
            >
              {[
                "English",
                "Spanish",
                "French",
                "German",
                "Hindi",
                "Mandarin",
              ].map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <div className="rounded-xl border border-border p-4 bg-card/50">
            <label className="text-sm font-medium">Food preference</label>
            <select
              value={diet}
              onChange={(e) => setDiet(e.target.value)}
              className="mt-2 w-full rounded-md border border-border bg-background p-2 hover:border-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-muted"
            >
              {[
                "No preference",
                "Vegetarian",
                "Vegan",
                "Halal",
                "Jain",
                "Gluten-free",
              ].map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-1">
          <button
            className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 bg-gradient-to-r from-brand-muted to-brand-pastel hover:brightness-105 active:scale-95 transition"
          >
            Generate My Itinerary
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
}
