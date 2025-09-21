import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import InspirationCarousel from "@/components/wanderwise/InspirationCarousel";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth, getInitials } from "@/contexts/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/itinerary", label: "Itinerary" },
  { to: "/bookings", label: "Bookings" },
  { to: "/profile", label: "Profile" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/75 border-b border-border">
      <nav className="container flex items-center justify-between py-3">
        <Link to="/" className="font-extrabold text-lg tracking-tight">
          <span className="text-primary">Wander</span>
          <span className="text-foreground">Wise</span>
          <span className="ml-1 px-1.5 py-0.5 rounded bg-brand-beige/60 text-xs align-middle">AI</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navItems.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                cn(
                  "px-1 py-0.5 relative transition-colors",
                  "hover:text-primary",
                  isActive ? "text-primary" : "text-foreground/80",
                )
              }
            >
              <span className="after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:w-0 after:bg-brand-pastel after:transition-all hover:after:w-full" />
              {n.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-2 py-1.5 text-sm">
                <Avatar className="size-7">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback>{getInitials(user.name || user.email)}</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline-block max-w-[140px] truncate font-medium">{user.name}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-xs">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-foreground/70">{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/auth"
              className="hidden md:inline-flex items-center justify-center rounded-full px-3 py-1.5 text-sm font-medium border border-border hover:bg-brand-beige/60 transition"
            >
              Sign in
            </Link>
          )}

          <button
            aria-label="Open Menu"
            className="md:hidden inline-flex items-center justify-center size-10 rounded-full bg-background/80 border border-border shadow-sm active:scale-95 transition"
            onClick={() => setOpen((v) => !v)}
          >
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur">
          <div className="container py-2 grid">
            {navItems.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2 rounded-md transition-colors",
                    "hover:bg-brand-beige/50",
                    isActive ? "text-primary" : "text-foreground/80",
                  )
                }
              >
                {n.label}
              </NavLink>
            ))}

            {user ? (
              <button
                onClick={() => {
                  signOut();
                  setOpen(false);
                }}
                className="mt-2 inline-flex items-center justify-center rounded-md border border-border px-3 py-2 text-sm hover:bg-brand-beige/60 transition"
              >
                Sign out
              </button>
            ) : (
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center rounded-md border border-border px-3 py-2 text-sm hover:bg-brand-beige/60 transition"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<"home"|"about"|"help"|"terms"|"privacy">("home");
  const location = useLocation();
  const navigate = useNavigate();

  const openDialog = (s: typeof section) => {
    if (s === "home" && location.pathname !== "/") navigate("/");
    setSection(s);
    setOpen(true);
  };

  const titleMap = {
    home: "Welcome to WanderWise AI",
    about: "About WanderWise AI",
    help: "Help & Support",
    terms: "Terms and Conditions",
    privacy: "Privacy Policy",
  } as const;

  const descMap = {
    home: "Your agentic AI travel companion — plan smarter with voice chat, live updates, and personalized itineraries.",
    about: "WanderWise AI is powered by Google's top-tier cloud tools to deliver secure, fast, and intelligent travel planning.",
    help: "Need assistance? Ask the AI assistant, or reach out via the Contact section. We’re here to help.",
    terms: "By using WanderWise AI, you agree to our terms covering acceptable use, content, and service limitations.",
    privacy: "We collect minimal data to personalize your trips. You control your data. See full details in our Privacy Policy.",
  } as const;

  return (
    <footer className="mt-20 bg-gradient-to-br from-[#0b0f1a] via-[#0d1320] to-[#0b0f1a] border-t border-transparent [border-image:linear-gradient(90deg,theme(colors.sky.500),theme(colors.violet.500))_1]">
      <div className="container py-8 grid gap-3 text-white text-center">
        <p className="text-sm text-white font-medium">WanderWise AI is powered by Google's top-tier cloud tools. AI-Powered Trips, Made Just for You. From Dream to Destination — Smarter with AI. ✨ WanderWise AI is not just a chatbot — it’s an Agentic AI travel companion that plans, adapts, and acts for you.</p>
        <nav className="mx-auto flex flex-wrap items-center justify-center gap-6 text-xs text-white">
          <button onClick={() => openDialog("home")} className="hover:text-sky-400 transition-colors">Home</button>
          <button onClick={() => openDialog("about")} className="hover:text-sky-400 transition-colors">About</button>
          <button onClick={() => openDialog("help")} className="hover:text-sky-400 transition-colors">Help</button>
          <button onClick={() => openDialog("terms")} className="hover:text-sky-400 transition-colors">Terms and Conditions</button>
          <button onClick={() => openDialog("privacy")} className="hover:text-sky-400 transition-colors">Privacy Policy</button>
        </nav>
        <p className="text-xs text-white/80">Responsible AI: transparency, privacy-first, user control, and safety.</p>
        <p className="text-xs text-white/80">copyright@WanderWiseAI 2025</p>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{titleMap[section]}</DialogTitle>
            <DialogDescription>{descMap[section]}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </footer>
  );
}

export default function Layout() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <InspirationCarousel />
      <Footer />
    </div>
  );
}
