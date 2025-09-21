import { useState } from "react";
import { Download, Share2, Copy, MessageCircle, ChevronDown, Calendar, Wallet, Plane } from "lucide-react";
import { toast } from "sonner";
import { useAuth, getInitials } from "@/contexts/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface TripHistory {
  id: string;
  title: string;
  dates: string;
  total: string;
  summary?: string;
  highlights?: string[];
}

const trips: TripHistory[] = [
  { id: "t1", title: "Bengaluru → Goa Getaway", dates: "Feb 10–14, 2025", total: "$680", summary: "5-day coastal escape with heritage, beaches, and nightlife.", highlights: ["Old Goa churches", "Fort Aguada", "Anjuna Night Market", "Dudhsagar Falls"] },
  { id: "t2", title: "Bali Adventure", dates: "Mar 3–10, 2024", total: "$1,120", summary: "Temples, rice terraces, and island cuisine.", highlights: ["Uluwatu Temple", "Ubud Rice Terraces", "Nusa Penida Day Trip"] },
];

function buildShareText(t: TripHistory) {
  const base = `My trip: ${t.title} (${t.dates}) — Total ${t.total}`;
  const extras = t.highlights?.length ? `\nHighlights: ${t.highlights.join(", ")}` : "";
  const link = `${location.origin}/profile?trip=${t.id}`;
  return `${base}${extras}\nPlan: ${link}`;
}

function downloadTrip(t: TripHistory) {
  const content = JSON.stringify(t, null, 2);
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${t.title.replace(/\s+/g, "-")}.json`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success("Download started", { description: `${t.title} itinerary (.json)` });
}

function shareWhatsApp(t: TripHistory) {
  const text = encodeURIComponent(buildShareText(t));
  const waUrl = `https://wa.me/?text=${text}`;
  window.open(waUrl, "_blank", "noopener,noreferrer");
}

async function shareTrip(t: TripHistory) {
  const text = buildShareText(t);
  try {
    if (navigator.share) {
      await navigator.share({ title: t.title, text, url: location.origin + "/profile?trip=" + t.id });
      toast.success("Shared");
    } else {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard", { description: "Share text ready to paste" });
    }
  } catch (e) {
    toast.error("Share canceled");
  }
}

export default function Profile() {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const { user } = useAuth();
  const displayName = user?.name || user?.email || "Explorer";
  const greetingName = user?.name || "there";

  const tripsCount = trips.length;
  const totalSpent = trips.reduce((sum, t) => sum + (parseFloat(t.total.replace(/[^0-9.]/g, "")) || 0), 0);
  const totalSpentLabel = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(totalSpent);
  const recent = trips[0];

  return (
    <section className="container py-10 sm:py-14" id="profile">
      <div className="relative mb-8 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-sky-500/10 via-violet-500/10 to-emerald-400/10">
        <div className="absolute inset-0 opacity-60 [mask-image:radial-gradient(500px_200px_at_top,black,transparent)]">
          <div className="absolute -top-20 -left-28 h-64 w-64 rounded-full bg-sky-500/30 blur-3xl" />
          <div className="absolute -bottom-20 -right-28 h-64 w-64 rounded-full bg-violet-500/30 blur-3xl" />
        </div>

        <div className="relative grid gap-4 p-5 sm:p-6">
          {user && (
            <p className="text-lg sm:text-xl md:text-2xl font-extrabold leading-snug tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-muted via-sky-500 to-brand-pastel drop-shadow">
              Hi {greetingName}! This is your personal travel hub. Your trips, saved plans, and smart recommendations live here.
            </p>
          )}

          {user ? (
            <div className="flex items-start gap-4">
              <Avatar className="size-14 ring-2 ring-white/20">
                <AvatarImage src={user.avatarUrl} alt={displayName} />
                <AvatarFallback className="bg-background/60 text-foreground/90">{getInitials(displayName)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="text-lg sm:text-xl font-semibold leading-tight">{displayName}</div>
                <div className="text-xs text-foreground/70">{user.email}</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-base font-semibold leading-tight">Welcome</div>
                <p className="mt-1 text-sm text-foreground/80">WanderWiseAI: Sign in to see your name and personalized tips.</p>
              </div>
              <Link to="/auth" className="inline-flex items-center justify-center rounded-full border border-border px-3 py-1.5 text-sm font-medium hover:bg-white/10 transition">Sign in</Link>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="rounded-xl border border-white/15 bg-white/5 p-3">
              <div className="flex items-center gap-2 text-xs text-foreground/70"><Plane className="size-3.5" /> Trips</div>
              <div className="mt-1 text-lg font-semibold">{tripsCount}</div>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/5 p-3">
              <div className="flex items-center gap-2 text-xs text-foreground/70"><Wallet className="size-3.5" /> Total Spent</div>
              <div className="mt-1 text-lg font-semibold">{totalSpentLabel}</div>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/5 p-3">
              <div className="flex items-center gap-2 text-xs text-foreground/70"><Calendar className="size-3.5" /> Recent</div>
              <div className="mt-1 line-clamp-1 text-sm font-medium text-foreground/90">{recent?.title || "—"}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold">My Trips</h2>
      </div>

      <div className="grid gap-4">
        {trips.map((t) => (
          <Card key={t.id} className="group overflow-hidden border-white/15 bg-card/70 transition hover:border-brand-pastel/60 hover:shadow-lg">
            <CardHeader className="p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-base sm:text-lg font-semibold leading-tight">{t.title}</CardTitle>
                  <CardDescription className="mt-0.5">{t.dates}</CardDescription>
                </div>
                <div className="text-sm whitespace-nowrap rounded-full border border-border bg-background/60 px-2 py-1">Total: {t.total}</div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0">
              {t.summary && (
                <p className="text-sm text-foreground/80">{t.summary}</p>
              )}

              {t.highlights?.length ? (
                <button
                  onClick={() => setOpen((o) => ({ ...o, [t.id]: !o[t.id] }))}
                  className="mt-2 inline-flex items-center gap-1 text-xs text-foreground/70 hover:text-foreground transition"
                >
                  <ChevronDown className={`size-4 transition-transform ${open[t.id] ? "rotate-180" : ""}`} />
                  {open[t.id] ? "Hide highlights" : `Show highlights (${t.highlights.length})`}
                </button>
              ) : null}

              {open[t.id] && t.highlights && (
                <ul className="mt-2 list-disc pl-5 text-sm text-foreground/80 space-y-1">
                  {t.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => downloadTrip(t)}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium border border-border hover:bg-brand-beige/60 transition"
                >
                  <Download className="size-4" />
                  Download
                </button>
                <button
                  onClick={() => shareTrip(t)}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-brand-muted to-brand-pastel hover:brightness-110 active:scale-95 transition"
                >
                  <Share2 className="size-4" />
                  Share
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(buildShareText(t));
                    toast.success("Copied", { description: "Trip details copied" });
                  }}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium border border-border hover:bg-brand-beige/60 transition"
                >
                  <Copy className="size-4" />
                  Copy
                </button>
                <button
                  onClick={() => shareWhatsApp(t)}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-white bg-[#25D366] hover:brightness-110 active:scale-95 transition"
                  aria-label="Share on WhatsApp"
                >
                  <MessageCircle className="size-4" />
                  WhatsApp
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
