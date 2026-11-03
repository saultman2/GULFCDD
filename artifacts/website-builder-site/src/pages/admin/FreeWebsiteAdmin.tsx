import { useSEO } from "@/hooks/useSEO";
import { OwnerGoogleSignIn } from "@/campaign/CampaignAdminAccess";

export default function FreeWebsiteAdmin() {
  useSEO({
    title: "Free Website Campaign Admin | GulfCDD",
    description: "Private campaign administration.",
    noindex: true,
  });
  return (
    <main className="min-h-screen bg-background px-5 py-16">
      <OwnerGoogleSignIn />
    </main>
  );
}
