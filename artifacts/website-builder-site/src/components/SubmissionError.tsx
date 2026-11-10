import { useEffect, useRef } from "react";
import { EmailLink } from "@/components/EmailLink";

/** Keep failed submissions visible and announced even at the end of a long form. */
export function SubmissionError({ message }: { message: string }) {
  const alert = useRef<HTMLDivElement>(null);
  useEffect(() => {
    alert.current?.focus({ preventScroll: true });
    alert.current?.scrollIntoView({ block: "center", behavior: "instant" });
  }, []);

  return (
    <div ref={alert} role="alert" tabIndex={-1} className="rounded-lg border-2 border-red-500 bg-neutral-900 px-4 py-4 text-sm text-white focus:outline-none">
      <p className="mb-2 font-bold">Your request wasn’t sent.</p>
      <p className="leading-relaxed">{message}</p>
      <p className="mt-2">Your details are still here. You can retry or{" "}
        <EmailLink className="font-semibold underline underline-offset-4">email us directly</EmailLink>.
      </p>
    </div>
  );
}
