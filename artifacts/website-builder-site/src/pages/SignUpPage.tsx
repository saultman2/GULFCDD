import { useEffect } from "react";
import { SignUp } from "@clerk/react";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function SignUpPage() {
  useEffect(() => {
    document.title = "Sign Up | GulfCDD";
    const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (robots) robots.setAttribute("content", "noindex, nofollow");
    return () => {
      if (robots) robots.setAttribute("content", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");
    };
  }, []);
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16">
      <SignUp
        routing="path"
        path={`${basePath}/sign-up`}
        signInUrl={`${basePath}/sign-in`}
        fallbackRedirectUrl={`${basePath}/account`}
      />
    </div>
  );
}
