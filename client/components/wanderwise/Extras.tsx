export default function Extras() {
  return (
    <section className="container py-10 sm:py-14 grid gap-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-border p-4 bg-card/60">
          <h3 className="font-semibold mb-2">Immersive</h3>
          <div className="flex flex-wrap gap-2">
            <button className="rounded-full px-3 py-2 text-xs font-medium bg-brand-beige/70 hover:brightness-105 transition">AR Scan Landmark</button>
            <button className="rounded-full px-3 py-2 text-xs font-medium bg-brand-beige/70 hover:brightness-105 transition">VR Preview Hotel/Restaurant</button>
          </div>
        </div>
        <div className="rounded-2xl border border-border p-4 bg-card/60">
          <h3 className="font-semibold mb-2">Sustainability</h3>
          <ul className="text-sm list-disc pl-5 space-y-1">
            <li>🌱 Eco badges for low-impact stays</li>
            <li>🚆 AI suggests public transport routes</li>
            <li>🤝 Volunteer and community tours</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
