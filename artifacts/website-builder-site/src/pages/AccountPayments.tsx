import { useEffect, useState } from "react";
import { AccountLayout } from "@/components/AccountLayout";
import { Download, CheckCircle2, Clock, CreditCard, ExternalLink } from "lucide-react";

function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);
}

interface Invoice {
  id: string;
  number: string | null;
  date: string;
  description: string;
  amount: number;
  currency: string;
  status: string | null;
  hostedUrl: string | null;
  pdf: string | null;
}

function fmt(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(cents / 100);
}

export default function AccountPayments() {
  useNoIndex();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/account/payments")
      .then((r) => r.json())
      .then((data) => {
        setInvoices(data.invoices ?? []);
        setLoading(false);
      });
  }, []);

  const total = invoices.reduce((sum, inv) => sum + (inv.status === "paid" ? inv.amount : 0), 0);

  return (
    <AccountLayout>
      <div className="px-6 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-heading font-semibold mb-1">Payment History</h1>
          <p className="text-muted-foreground text-sm">All invoices and receipts for your account.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1 font-medium">Total paid</p>
            <p className="text-xl font-bold text-primary">{invoices.length ? fmt(total, invoices[0]?.currency ?? "usd") : "No payments yet"}</p>
          </div>
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1 font-medium">Invoices</p>
            <p className="text-xl font-bold text-primary">{invoices.length}</p>
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : invoices.length === 0 ? (
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-8 text-center">
            <CreditCard className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm font-medium">No invoices found. Payments will appear here once you have an active plan.</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <p className="text-sm font-semibold">All invoices</p>
              <span className="text-xs text-muted-foreground">{invoices.length} records</span>
            </div>
            <div className="divide-y divide-border">
              {invoices.map((inv) => (
                <div key={inv.id} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/40 transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <CreditCard className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{inv.description}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(inv.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      {inv.number && <span className="ml-2 font-mono">{inv.number}</span>}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold">{fmt(inv.amount, inv.currency)}</p>
                    <span className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full mt-0.5 ${
                      inv.status === "paid" ? "bg-green-500/15 text-green-400" : "bg-yellow-500/15 text-yellow-400"
                    }`}>
                      {inv.status === "paid" ? <CheckCircle2 className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                      {inv.status === "paid" ? "Paid" : inv.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    {inv.hostedUrl && (
                      <a href={inv.hostedUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="View invoice">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {inv.pdf && (
                      <a href={inv.pdf} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Download PDF">
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
