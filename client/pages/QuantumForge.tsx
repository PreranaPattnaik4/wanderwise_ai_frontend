import SmartTimeline from "@/components/quantum/SmartTimeline";
import AssistantWidget from "@/components/quantum/AssistantWidget";

export default function QuantumForge() {
  return (
    <div className="min-h-dvh bg-[#0b0f1a] text-white">
      <section className="container pt-12 pb-6">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">Quantum-Forge</h1>
        <p className="mt-2 text-white/70 max-w-prose">Futuristic planning with AI. Explore the Smart Planning Timeline and interact with the AI Assistant.</p>
      </section>
      <SmartTimeline />
      <AssistantWidget />
    </div>
  );
}
