import { useEffect, useRef, useState } from "react";
import { Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Msg { id: string; role: "user" | "ai"; text: string }

export default function SideAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const recogRef = useRef<any>(null);
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: "m0", role: "ai", text: "Hello 👋 Ask me about your trip…" },
  ]);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [open, msgs]);

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
      for (let i = e.resultIndex; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
      }
      setInput(text);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recogRef.current = rec;
    rec.start();
  };

  const stopVoice = () => {
    try { recogRef.current?.stop(); } catch {}
    setListening(false);
  };

  const toggleVoice = () => {
    if (listening) stopVoice(); else startVoice();
  };

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
        aria-label="Open WanderWise AI Assistant"
        className="fixed bottom-4 right-4 z-50 size-14 rounded-full grid place-items-center text-white shadow-lg bg-gradient-to-tr from-sky-500 to-violet-500 hover:brightness-110 active:scale-95 transition"
      >
        <div className="relative">
          <Bot className="size-7 drop-shadow-[0_0_12px_rgba(56,189,248,0.8)]" />
          <span className="pointer-events-none absolute inset-0 rounded-full animate-[pulse_2s_ease-in-out_infinite] bg-sky-400/20 blur-md" />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md border-l border-white/20 bg-white/10 backdrop-blur-lg text-foreground shadow-[0_0_40px_rgba(99,102,241,0.35)] flex flex-col"
              initial={{ x: 420 }}
              animate={{ x: 0 }}
              exit={{ x: 420 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
            >
              <header className="px-4 py-3 border-b border-white/15 flex items-center justify-between">
                <div className="font-semibold">WanderWise AI Assistant</div>
                <button className="size-9 grid place-items-center rounded-full hover:bg-white/10" onClick={() => setOpen(false)} aria-label="Close">
                  <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </header>

              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                {msgs.map((m) => (
                  <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                    <div className={(m.role === "user" ? "bg-violet-600/30" : "bg-white/10") + " rounded-2xl px-3 py-2 max-w-[85%] border border-white/15"}>{m.text}</div>
                  </div>
                ))}
                <div ref={endRef} />
              </div>

              <div className="p-3 border-t border-white/15 flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Message your AI guide"
                  className="flex-1 rounded-full bg-white/10 border border-white/20 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                />
                <button
                  className={"inline-grid place-items-center size-10 rounded-full border border-white/20 text-foreground/80 hover:bg-white/10 transition " + (listening ? "animate-pulse-ring" : "")}
                  aria-label="Voice"
                  type="button"
                  aria-pressed={listening}
                  onClick={toggleVoice}
                >
                  <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zm7 10a7 7 0 0 1-14 0M12 19v4m-4 0h8"/></svg>
                </button>
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
