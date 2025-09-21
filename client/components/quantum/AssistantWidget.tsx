import { useEffect, useRef, useState } from "react";
import { Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Msg { id: string; role: "user" | "ai"; text: string }

export default function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: "m0", role: "ai", text: "Hello 👋 I’m your AI guide. How can I assist?" },
  ]);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [open, msgs]);

  const send = () => {
    if (!input.trim()) return;
    const user: Msg = { id: crypto.randomUUID(), role: "user", text: input.trim() };
    setMsgs((m) => [...m, user]);
    setInput("");
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open AI Assistant"
        className="fixed bottom-4 right-4 z-50 size-14 rounded-full grid place-items-center text-white shadow-lg bg-gradient-to-tr from-sky-500 to-violet-500 hover:brightness-110 active:scale-95 transition"
      >
        <div className="relative">
          <Bot className="size-7 drop-shadow-[0_0_12px_rgba(56,189,248,0.8)]" />
          <span className="absolute inset-0 rounded-full animate-[pulse_2s_ease-in-out_infinite] bg-sky-400/20 blur-md" />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-[#0b0f1a] text-white border-l border-white/10 shadow-2xl flex flex-col"
              initial={{ x: 420 }}
              animate={{ x: 0 }}
              exit={{ x: 420 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
            >
              <header className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <div className="font-semibold">Quantum-Forge AI Assistant</div>
                <button className="size-9 grid place-items-center rounded-full hover:bg-white/5" onClick={() => setOpen(false)} aria-label="Close">
                  <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </header>

              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                {msgs.map((m) => (
                  <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                    <div className={(m.role === "user" ? "bg-violet-600/30" : "bg-white/5") + " rounded-2xl px-3 py-2 max-w-[85%] border border-white/10"}>{m.text}</div>
                  </div>
                ))}
                <div ref={endRef} />
              </div>

              <div className="p-3 border-t border-white/10 flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Type a message"
                  className="flex-1 rounded-full bg-white/5 border border-white/10 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                />
                <button onClick={send} className="inline-grid place-items-center size-10 rounded-full text-white bg-gradient-to-tr from-sky-500 to-violet-500 hover:brightness-110 active:scale-95 transition" aria-label="Send">
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
