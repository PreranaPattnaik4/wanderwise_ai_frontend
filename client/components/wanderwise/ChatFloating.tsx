import { useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  role: "user" | "agent";
  text: string;
}

export default function ChatFloating() {
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const recogRef = useRef<any>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: "m1", role: "agent", text: "Welcome to WanderWise! How can I assist with your trip today?" },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

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
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", text: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTimeout(() => {
      const reply: Message = { id: crypto.randomUUID(), role: "agent", text: "{{chatMessage}} Sample AI response. This UI is ready to connect to your AI backend." };
      setMessages((m) => [...m, reply]);
    }, 500);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 inline-flex items-center justify-center size-14 rounded-full shadow-lg text-white bg-gradient-to-br from-brand-muted to-brand-pastel hover:brightness-110 active:scale-95 transition animate-fade-up"
        aria-label="Open chat"
      >
        <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a4 4 0 0 1-4 4H8l-5 5V6a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-end sm:place-items-center bg-black/30 p-2" onClick={() => setOpen(false)}>
          <div className="w-full sm:max-w-md rounded-2xl bg-background border border-border shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="font-semibold">WanderWise Assistant</div>
              <button className="size-9 grid place-items-center rounded-full hover:bg-muted/60" onClick={() => setOpen(false)} aria-label="Close">
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="h-[60dvh] sm:h-[420px] overflow-y-auto px-4 py-3 space-y-2">
              {messages.map((m) => (
                <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div
                    className={
                      (m.role === "user"
                        ? "bg-brand-pastel/30 text-foreground"
                        : "bg-brand-beige/70 text-foreground") +
                      " rounded-2xl px-3 py-2 max-w-[85%] shadow"
                    }
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            <div className="border-t border-border p-3 flex items-center gap-2">
              <button
                className={
                  "relative inline-grid place-items-center size-10 rounded-full border border-border text-foreground/80 transition " +
                  (listening ? "animate-pulse-ring" : "hover:bg-muted/60")
                }
                aria-label="Voice input"
                aria-pressed={listening}
                onClick={toggleVoice}
              >
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zm7 10a7 7 0 0 1-14 0M12 19v4m-4 0h8"/></svg>
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message"
                className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-muted"
                onKeyDown={(e) => e.key === "Enter" && send()}
              />
              <button
                onClick={send}
                className="inline-grid place-items-center size-10 rounded-full text-white shadow-md bg-gradient-to-br from-brand-muted to-brand-pastel hover:brightness-110 active:scale-95 transition"
                aria-label="Send"
              >
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
