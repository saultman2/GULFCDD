import { useEffect, useState } from "react";
import { AccountLayout } from "@/components/AccountLayout";
import { CreditCard, MessageSquare, ChevronRight, Zap, CheckCircle2, AlertCircle } from "lucide-react";

interface AccountData {
  user: { id: string; email: string; name: string };
  subscription: {
    status: string;
    planKey: string;
    currentPeriodEnd: string;
    amount: number;
    interval: string;
  } | null;
}

interface Message {
  id: number;
  content: string;
  fromAdmin: boolean;
  createdAt: string;
  userName: string;
}

const PLAN_LABELS: Record<string, string> = {
  essential: "Essential",
  growth: "Growth",
  "full-service": "Full Service",
  full: "Full Service",
};

function fmt(cents: number) {
  return `$${(cents / 100).toFixed(0)}`;
}

export default function AccountDashboard() {
  const [account, setAccount] = useState<AccountData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);

  useEffect(() => {
    Promise.all([
      fetch("/api/account/me").then((r) => r.json()),
      fetch("/api/account/messages").then((r) => r.json()),
    ]).then(([acct, msgs]) => {
      setAccount(acct);
      setMessages((msgs.messages ?? []).slice(0, 4));
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <AccountLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      </AccountLayout>
    );
  }

  const sub = account?.subscription;
  const firstName = account?.user.name.split(" ")[0] ?? "there";
  const planLabel = sub ? (PLAN_LABELS[sub.planKey] ?? sub.planKey) : null;
  const nextBilling = sub ? new Date(sub.currentPeriodEnd).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : null;

  return (
    <AccountLayout>
      <div className="px-6 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-heading font-semibold mb-1">Welcome, {firstName}</h1>
          <p className="text-muted-foreground text-sm">Here is a summary of your account.</p>
        </div>

        {sub ? (
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary">{planLabel} Plan</span>
                  {sub.status === "active" ? (
                    <span className="inline-flex items-center gap-1 text-xs bg-green-500/15 text-green-400 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs bg-yellow-500/15 text-yellow-400 px-2 py-0.5 rounded-full">
                      <AlertCircle className="w-3 h-3" /> {sub.status}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-6 mt-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs mb-0.5">Monthly</p>
                    <p className="font-semibold">{fmt(sub.amount)} / mo</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-0.5">Next billing</p>
                    <p className="font-semibold">{nextBilling}</p>
                  </div>
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 mb-6">
            <p className="text-muted-foreground text-sm font-medium">No active plan found. <a href="/pricing/" className="text-accent hover:underline font-bold">View plans</a></p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-5 mb-6">
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold">Messages</p>
              <a href="/account/messages" className="text-xs text-primary flex items-center gap-0.5 hover:text-primary/80">
                View all <ChevronRight className="w-3 h-3" />
              </a>
            </div>
            {messages.length === 0 ? (
              <p className="text-xs text-muted-foreground">No messages yet. <a href="/account/messages" className="text-primary hover:underline">Send one</a></p>
            ) : (
              <div className="space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className="flex gap-2.5 items-start">
                    <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs font-semibold mt-0.5 ${m.fromAdmin ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {m.fromAdmin ? "G" : m.userName[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium">{m.fromAdmin ? "GulfCDD" : "You"}</p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{m.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5">
            <p className="text-sm font-semibold mb-4">Quick links</p>
            <div className="space-y-2">
              {[
                { href: "/account/messages", icon: MessageSquare, label: "Send a message or request" },
                { href: "/account/payments", icon: CreditCard, label: "View payment history" },
                { href: "/contact", icon: ChevronRight, label: "Start a new project" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors group"
                >
                  <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground shrink-0" />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground">{item.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}
