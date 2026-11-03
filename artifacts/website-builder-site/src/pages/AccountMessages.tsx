import { useEffect, useRef, useState } from "react";
import { AccountLayout } from "@/components/AccountLayout";
import { Send } from "lucide-react";
import { EmailLink } from "@/components/EmailLink";
import { useToast } from "@/hooks/use-toast";

function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);
}

interface Message {
  id: number;
  content: string;
  fromAdmin: boolean;
  createdAt: string;
  userName: string;
}

export default function AccountMessages() {
  useNoIndex();
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  function loadMessages() {
    return fetch("/api/account/messages")
      .then((r) => r.json())
      .then((data) => setMessages((data.messages ?? []).slice().reverse()));
  }

  useEffect(() => {
    loadMessages().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/account/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      });
      if (!res.ok) throw new Error("Failed");
      setContent("");
      await loadMessages();
    } catch {
      toast({ title: "Could not send", description: "Please try again.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  }

  return (
    <AccountLayout>
      <div className="flex flex-col h-[calc(100vh-65px)]">
        <div className="px-6 py-5 border-b border-border shrink-0">
          <h1 className="text-xl font-heading font-semibold">Messages</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Ask a question or tell us what you'd like changed. We'll reply by email using the contact details on your account.
          </p>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Send className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm max-w-xs">
                No messages yet. Type your question or request below and we will get back to you.
              </p>
            </div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={`flex gap-3 ${!m.fromAdmin ? "flex-row-reverse" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5 ${m.fromAdmin ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                  {m.fromAdmin ? "G" : m.userName[0]?.toUpperCase() ?? "?"}
                </div>
                <div className={`max-w-[75%] flex flex-col ${!m.fromAdmin ? "items-end" : "items-start"}`}>
                  <div className={`px-4 py-3 rounded-xl text-sm leading-relaxed font-medium shadow-sm ${
                    m.fromAdmin
                      ? "bg-white border border-slate-200 text-foreground"
                      : "bg-accent text-white"
                  }`}>
                    {m.content}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 px-1">
                    {new Date(m.createdAt).toLocaleString("en-US", {
                      month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 shrink-0">
          <form onSubmit={handleSend} className="flex items-center gap-3 bg-white border border-slate-200 shadow-sm rounded-xl px-4 py-3">
            <input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type a message or request a change…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground font-medium"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={!content.trim() || sending}
              className="w-10 h-10 rounded-lg bg-accent hover:bg-accent/90 disabled:opacity-40 flex items-center justify-center transition-colors shrink-0 shadow-sm"
            >
              {sending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4 text-white" />
              )}
            </button>
          </form>
          <p className="text-xs text-muted-foreground mt-3 px-1 font-medium">
            We reply by email at {" "}
            <EmailLink className="text-accent hover:underline font-bold">aultman@gulfcoastdigitaldesign.com</EmailLink>. Check your inbox for responses.
          </p>
        </div>
      </div>
    </AccountLayout>
  );
}
