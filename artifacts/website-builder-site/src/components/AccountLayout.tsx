import { useClerk, useUser } from "@clerk/react";
import { LayoutDashboard, CreditCard, MessageSquare, LogOut, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";

interface AccountLayoutProps {
  children: React.ReactNode;
}

export function AccountLayout({ children }: AccountLayoutProps) {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [location] = useLocation();

  const navItems = [
    { href: "/account", label: "Dashboard", icon: LayoutDashboard },
    { href: "/account/payments", label: "Payments", icon: CreditCard },
    { href: "/account/messages", label: "Messages", icon: MessageSquare },
  ];

  const isActive = (href: string) => location === href;
  const initials = user
    ? ((user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? "")).toUpperCase() ||
      user.emailAddresses[0]?.emailAddress?.[0]?.toUpperCase() ||
      "?"
    : "?";
  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.emailAddresses[0]?.emailAddress ||
    "";

  return (
    <div className="min-h-screen bg-slate-50 text-foreground flex flex-col">
      {/* Top header */}
      <header className="border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 bg-white">
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-2.5">
            <img src="/images/gulfcdd-logo.webp" alt="GulfCDD" width={128} height={32} decoding="async" className="h-8 w-auto" />
          </a>
          <span className="text-slate-300">|</span>
          <span className="text-sm text-primary font-bold">My Account</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white shadow-sm">
              {initials}
            </div>
            <span className="text-sm text-muted-foreground hidden sm:block font-medium">{displayName}</span>
          </div>
          <button
            onClick={() => signOut({ redirectUrl: "/" })}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:block">Sign out</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-52 shrink-0 border-r border-slate-200 py-6 px-3 hidden md:block bg-slate-50/30">
          <nav className="space-y-0.5">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors group ${
                  isActive(item.href)
                    ? "bg-primary/5 text-primary"
                    : "text-muted-foreground hover:text-primary hover:bg-slate-100"
                }`}
              >
                <item.icon className={`w-4 h-4 shrink-0 ${isActive(item.href) ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} />
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Mobile bottom nav */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 flex md:hidden shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                isActive(item.href) ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive(item.href) ? "text-primary" : ""}`} />
              {item.label}
            </a>
          ))}
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          {children}
        </main>
      </div>
    </div>
  );
}
