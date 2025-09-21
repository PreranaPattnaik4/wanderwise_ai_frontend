import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plane, MapPin, SlidersHorizontal, Sparkles, Mic, Settings2 } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

const tripTypes = [
  { key: "leisure", label: "Leisure" },
  { key: "adventure", label: "Adventure" },
  { key: "business", label: "Business" },
  { key: "family", label: "Family" },
  { key: "romance", label: "Romance" },
];

const flightPrefs = [
  { key: "nonstop", label: "Non‑stop" },
  { key: "onestop", label: "1 stop ok" },
  { key: "economy", label: "Economy" },
  { key: "premium", label: "Premium" },
  { key: "business", label: "Business" },
];

function buildSuggestion({ from, to, typeKeys, prefKeys, query }: { from: string; to: string; typeKeys: string[]; prefKeys: string[]; query: string; }) {
  const title = from && to ? `${from} → ${to}` : (to || from || "Your Trip");
  const kinds = typeKeys.length ? typeKeys.map((k) => tripTypes.find((t) => t.key === k)?.label || k) : ["Personalized"];
  const prefs = prefKeys.length ? prefKeys.map((k) => flightPrefs.find((f) => f.key === k)?.label || k) : ["Flexible options"];
  const q = query.trim();
  const notes = q ? `Based on your query: “${q}”.` : "Refine results by adding dates, budget, or interests.";

  const flights = [
    { name: "Non‑stop • Economy", match: prefKeys.includes("nonstop") || prefKeys.includes("economy") },
    { name: "1‑stop • Cheapest", match: prefKeys.includes("onestop") || !prefKeys.length },
    { name: "Premium / Business", match: prefKeys.includes("premium") || prefKeys.includes("business") },
  ].filter((f) => f.match).map((f) => f.name);

  const activitiesFallback = [
    "City highlights & landmarks",
    "Local food tour",
    "Neighborhood walk & markets",
  ];

  return {
    title,
    subtitle: kinds.join(" • "),
    notes,
    flights: flights.length ? flights : ["Compare best fares across cabins"],
    activities: activitiesFallback,
  };
}

const interests = [
  { key: "adventure", label: "Adventure" },
  { key: "heritage", label: "Heritage" },
  { key: "food", label: "Food" },
  { key: "nightlife", label: "Nightlife" },
  { key: "activities", label: "Activities" },
  { key: "office", label: "Office Tour" },
] as const;

export default function TripPlanner() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [query, setQuery] = useState("");
  const [listening, setListening] = useState(false);
  const recogRef = (typeof window !== "undefined" ? (window as any).recogRef : null) as any;
  const [types, setTypes] = useState<Record<string, boolean>>({ leisure: true });
  const [prefs, setPrefs] = useState<Record<string, boolean>>({ economy: true, nonstop: true });
  const [show, setShow] = useState(false);
  const [budget, setBudget] = useState(1500);
  const [days, setDays] = useState(5);
  const [language, setLanguage] = useState("English");
  const [diet, setDiet] = useState("No preference");
  const [interestActive, setInterestActive] = useState<Record<string, boolean>>({ adventure: true });
  const [interestChoices, setInterestChoices] = useState<Record<string, Record<string, boolean>>>(() => ({
    adventure: { Hiking: false, "Water sports": false, "Road trips": false, Safari: false },
    heritage: { Museums: false, Temples: false, "Historic walks": false, Architecture: false },
    food: { "Street food": false, "Fine dining": false, Cafes: false, "Local markets": false },
    nightlife: { Clubs: false, Bars: false, "Live music": false, Rooftops: false },
    activities: { Spa: false, Shopping: false, Photography: false, Workshops: false },
    office: { "Meet the team": false, "Workspace tour": false, "Tech talk": false, "Cafeteria lunch": false, "Commute guidance": false },
  }));

  const typeKeys = useMemo(() => Object.keys(types).filter((k) => types[k]), [types]);
  const prefKeys = useMemo(() => Object.keys(prefs).filter((k) => prefs[k]), [prefs]);
  const suggestion = useMemo(() => buildSuggestion({ from, to, typeKeys, prefKeys, query }), [from, to, typeKeys, prefKeys, query]);

  const toggle = (setter: (u: any) => void) => (key: string) => setter((s: Record<string, boolean>) => ({ ...s, [key]: !s[key] }));

  const startVoice = () => {
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      alert("Voice input not supported in this browser.");
      return;
    }
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.onstart = () => setListening(true);
    rec.onresult = (e: any) => {
      let text = "";
      for (let i = e.resultIndex; i < e.results.length; i++) text += e.results[i][0].transcript;
      setQuery(text);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    (window as any).recogRef = rec;
    rec.start();
  };
  const stopVoice = () => {
    try { (window as any).recogRef?.stop(); } catch {}
    setListening(false);
  };
  const toggleVoice = () => { listening ? stopVoice() : startVoice(); };

  const parseQuery = () => {
    const m = query.match(/from\s+([^,]+?)\s+(?:to|→)\s+([^,]+)\b/i);
    if (m) {
      setFrom((m[1] || "").trim());
      setTo((m[2] || "").trim());
    }
    setShow(true);
  };

  return (
    <div className="grid gap-4">
      <Card className="border-white/15 bg-card/70">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2"><SlidersHorizontal className="size-4" /> Quick Planner</CardTitle>
          <CardDescription>Write where you want to go and your preferences. We’ll suggest a plan.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="grid gap-1 text-sm">
              <span className="text-foreground/70">From</span>
              <div className="relative">
                <MapPin className="size-4 absolute left-2 top-2.5 text-foreground/50" />
                <input
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="e.g., Bengaluru"
                  className="w-full rounded-md border border-border bg-background pl-8 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-muted"
                />
              </div>
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-foreground/70">To</span>
              <div className="relative">
                <Plane className="size-4 absolute left-2 top-2.5 text-foreground/50" />
                <input
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="e.g., Goa or Bali"
                  className="w-full rounded-md border border-border bg-background pl-8 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-pastel"
                />
              </div>
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-border p-3 bg-background/60">
              <div className="text-xs font-medium mb-2">Type of trip</div>
              <div className="flex flex-wrap gap-2">
                {tripTypes.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => toggle(setTypes)(t.key)}
                    className={(types[t.key] ? "bg-brand-pastel/20 ring-1 ring-brand-pastel" : "bg-background") + " rounded-full px-3 py-1.5 text-xs border border-border hover:shadow transition"}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border p-3 bg-background/60">
              <div className="text-xs font-medium mb-2">Flight options</div>
              <div className="flex flex-wrap gap-2">
                {flightPrefs.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => toggle(setPrefs)(f.key)}
                    className={(prefs[f.key] ? "bg-brand-beige/70 ring-1 ring-brand-muted/50" : "bg-background") + " rounded-full px-3 py-1.5 text-xs border border-border hover:shadow transition"}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <label className="grid gap-1 text-sm">
            <span className="text-foreground/70">Describe your trip (optional)</span>
            <div className="relative">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., Weekend getaway from Bengaluru to Goa next month, beach + nightlife, non���stop flights"
                rows={3}
                className="w-full rounded-md border border-border bg-background px-3 py-2 pr-12 text-sm outline-none focus:ring-2 focus:ring-brand-muted"
              />
              <button
                type="button"
                aria-label="Voice input"
                aria-pressed={listening}
                onClick={toggleVoice}
                className={"absolute right-2 bottom-2 inline-grid place-items-center size-9 rounded-full border border-border text-foreground/80 " + (listening ? "animate-pulse-ring" : "hover:bg-muted/60")}
              >
                <Mic className="size-4" />
              </button>
            </div>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <button className="rounded-full border border-border bg-background px-3 py-1.5 text-xs hover:shadow inline-flex items-center gap-2"><Settings2 className="size-4" /> Budget: ${budget}</button>
              </PopoverTrigger>
              <PopoverContent align="start">
                <div className="text-xs font-semibold mb-2">Budget ($)</div>
                <input type="range" min={200} max={10000} value={budget} onChange={(e) => setBudget(parseInt(e.target.value))} className="w-full" />
                <div className="mt-2 text-sm">${budget}</div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <button className="rounded-full border border-border bg-background px-3 py-1.5 text-xs hover:shadow inline-flex items-center gap-2"><Settings2 className="size-4" /> Duration: {days}d</button>
              </PopoverTrigger>
              <PopoverContent align="start">
                <div className="text-xs font-semibold mb-2">Trip Duration (days)</div>
                <input type="range" min={1} max={30} value={days} onChange={(e) => setDays(parseInt(e.target.value))} className="w-full" />
                <div className="mt-2 text-sm">{days} days</div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <button className="rounded-full border border-border bg-background px-3 py-1.5 text-xs hover:shadow inline-flex items-center gap-2"><Settings2 className="size-4" /> Language: {language}</button>
              </PopoverTrigger>
              <PopoverContent align="start">
                <div className="text-xs font-semibold mb-2">Language</div>
                <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full rounded-md border border-border bg-background p-2 text-sm">
                  {['English','Spanish','French','German','Hindi','Mandarin'].map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <button className="rounded-full border border-border bg-background px-3 py-1.5 text-xs hover:shadow inline-flex items-center gap-2"><Settings2 className="size-4" /> Food: {diet}</button>
              </PopoverTrigger>
              <PopoverContent align="start">
                <div className="text-xs font-semibold mb-2">Food preference</div>
                <select value={diet} onChange={(e) => setDiet(e.target.value)} className="w-full rounded-md border border-border bg-background p-2 text-sm">
                  {['No preference','Vegetarian','Vegan','Halal','Jain','Gluten-free'].map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <button className="rounded-full border border-border bg-background px-3 py-1.5 text-xs hover:shadow inline-flex items-center gap-2"><Settings2 className="size-4" /> Interests</button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-80">
                <div className="text-xs font-semibold mb-2">Interests</div>
                <div className="grid gap-3">
                  {interests.map((it) => {
                    const choices = interestChoices[it.key] || {};
                    const selected = Object.values(choices).filter(Boolean).length;
                    return (
                      <div key={it.key} className="rounded-md border border-border p-2">
                        <div className="flex items-center justify-between">
                          <label className="inline-flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={!!interestActive[it.key]} onChange={() => setInterestActive((s) => ({ ...s, [it.key]: !s[it.key] }))} />
                            <span className="font-medium">{it.label}</span>
                          </label>
                          <span className="text-xs text-foreground/70">{selected ? `${selected} selected` : ""}</span>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          {Object.keys(choices).map((opt) => (
                            <label key={opt} className="flex items-center gap-2 text-xs">
                              <Checkbox checked={!!interestChoices[it.key][opt]} onCheckedChange={(v) => setInterestChoices((prev) => ({ ...prev, [it.key]: { ...prev[it.key], [opt]: !!v } }))} />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="pt-1 flex items-center justify-end">
            <button
              onClick={parseQuery}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-brand-muted to-brand-pastel hover:brightness-110 active:scale-95 transition"
            >
              <Sparkles className="size-4" /> Suggest Plan
            </button>
          </div>
        </CardContent>
      </Card>

      {show && (
        <Card className="border-white/15 bg-card/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{suggestion.title}</CardTitle>
            <CardDescription>{suggestion.subtitle}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <p className="text-sm text-foreground/80">{suggestion.notes}</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-border p-3 bg-background/60">
                <div className="text-xs font-medium mb-1">Suggested flights</div>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {suggestion.flights.map((f: string, i: number) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-border p-3 bg-background/60">
                <div className="text-xs font-medium mb-1">Activities to consider</div>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {suggestion.activities.map((a: string, i: number) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
