import { lazy, useState } from "react";
import { useAuth, useClerk, useSignIn } from "@clerk/react";
import { Lock } from "lucide-react";
import { Link } from "wouter";
const FreeWebsiteAdmin = lazy(() => import("@/pages/admin/FreeWebsiteAdmin"));

const adminPath = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/admin/free-website/`;

export function OwnerGoogleSignIn() {
  const { isSignedIn, isLoaded } = useAuth();
  const { signOut } = useClerk();
  const { signIn } = useSignIn();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function start() {
    setBusy(true); setError("");
    try {
      if (isSignedIn) {
        await signOut({ redirectUrl: adminPath });
        return;
      }
      if (!signIn) throw new Error("Sign-in is still loading. Please try again.");
      const result = await signIn.sso({
        strategy: "oauth_google",
        redirectCallbackUrl: `${window.location.origin}${adminPath}sso-callback/`,
        redirectUrl: `${window.location.origin}${adminPath}`,
      });
      if (result.error) throw result.error;
    } catch {
      setError("Google sign-in couldn't start. Please try again. If it remains unavailable, Google must be enabled in the workspace Auth pane.");
      setBusy(false);
    }
  }
  return (
    <div className="mx-auto max-w-md space-y-5 text-center">
      <Lock className="mx-auto h-8 w-8 text-accent" aria-hidden="true" />
      <h1 className="text-2xl font-bold text-white">Owner dashboard</h1>
      <p className="text-sm leading-relaxed text-white/70">
        This dashboard is only available to <strong className="block break-all text-white">aultman@gulfcoastdigitaldesign.com</strong> using Google sign-in.
      </p>
      <button type="button" disabled={!isLoaded || busy} onClick={start}
        className="w-full rounded-md bg-accent px-5 py-3 font-semibold text-white hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:opacity-50"
        data-testid="button-owner-google">
        {busy ? "Opening Google…" : isSignedIn ? "Sign out to use the owner's Google account" : "Continue with Google"}
      </button>
      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      <div id="clerk-captcha" />
      <Link href="/" className="inline-block text-sm text-white/60 underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">Back to website</Link>
    </div>
  );
}

export default function CampaignAdminAccess() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return <main className="min-h-screen grid place-items-center"><p role="status">Loading sign-in…</p></main>;
  if (isSignedIn) return <FreeWebsiteAdmin />;
  return <main className="min-h-screen bg-background flex items-center justify-center px-5 py-16"><OwnerGoogleSignIn /></main>;
}
