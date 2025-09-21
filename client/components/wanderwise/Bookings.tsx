interface FlightOption {
  id: string;
  route: string; // e.g., BLR → GOI
  from: string;
  to: string;
  depart: string; // time
  arrive: string; // time
  date: string;
  duration: string;
  airline: string;
  price: string;
}

function FlightCard(f: FlightOption) {
  return (
    <div className="rounded-xl overflow-hidden border border-border bg-card/60 shadow-sm">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">{f.route}</h4>
          <span className="text-xs px-2 py-1 rounded-full bg-brand-beige/70">Flight</span>
        </div>
        <div className="mt-1 text-sm text-foreground/80">{f.airline} • {f.date}</div>
        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-xs text-foreground/70">Depart</div>
            <div className="font-medium">{f.from} {f.depart}</div>
          </div>
          <div>
            <div className="text-xs text-foreground/70">Arrive</div>
            <div className="font-medium">{f.to} {f.arrive}</div>
          </div>
          <div>
            <div className="text-xs text-foreground/70">Duration</div>
            <div className="font-medium">{f.duration}</div>
          </div>
          <div>
            <div className="text-xs text-foreground/70">Price</div>
            <div className="font-medium">{f.price}</div>
          </div>
        </div>
        <button className="mt-4 w-full rounded-full px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-brand-muted to-brand-pastel hover:brightness-110 active:scale-95 transition">
          Book Now
        </button>
      </div>
    </div>
  );
}

interface BookingCardProps {
  image: string;
  name: string;
  price: string;
  rating: number;
}

function BookingCard({ image, name, price, rating }: BookingCardProps) {
  return (
    <div className="rounded-xl overflow-hidden border border-border bg-card/60 shadow-sm">
      <img src={image} alt={name} className="w-full h-36 object-cover" />
      <div className="p-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm">{name}</h4>
          <span className="text-xs text-foreground/70">⭐ {rating.toFixed(1)}</span>
        </div>
        <div className="mt-1 text-sm">{price}</div>
        <button className="mt-3 w-full rounded-full px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-brand-muted to-brand-pastel hover:brightness-110 active:scale-95 transition">
          Book Now
        </button>
      </div>
    </div>
  );
}

export default function Bookings() {
  const flights: FlightOption[] = [
    {
      id: "out",
      route: "Bengaluru (BLR) → Goa (GOI)",
      from: "BLR",
      to: "GOI",
      depart: "07:45",
      arrive: "09:15",
      date: "Mon, 10 Feb",
      duration: "1h 30m nonstop",
      airline: "IndiGo",
      price: "$68",
    },
    {
      id: "ret",
      route: "Goa (GOI) → Bengaluru (BLR)",
      from: "GOI",
      to: "BLR",
      depart: "18:30",
      arrive: "20:00",
      date: "Fri, 14 Feb",
      duration: "1h 30m nonstop",
      airline: "Vistara",
      price: "$72",
    },
  ];

  return (
    <section className="container py-10 sm:py-14" id="bookings">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4">Bookings</h2>
      <p className="text-sm text-foreground/70 mb-3">Trip: Bengaluru ↔ Goa • 5 days</p>

      {/* Flights */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        {flights.map((f) => (
          <FlightCard key={f.id} {...f} />
        ))}
      </div>

      {/* Stays & experiences */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <BookingCard image="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=800&auto=format&fit=crop" name="Goa Beach Hotel" price="$89/night" rating={4.4} />
        <BookingCard image="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop" name="Spice Farm Tour" price="$35" rating={4.7} />
        <BookingCard image="https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=800&auto=format&fit=crop" name="Water Sports Pack" price="$49" rating={4.5} />
      </div>
    </section>
  );
}
