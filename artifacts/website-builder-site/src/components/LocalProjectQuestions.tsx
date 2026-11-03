const localQuestions: Record<string, string> = {
  "ocean-springs": "For an Ocean Springs website or redesign, share your current site, the services customers need to find, and the towns you actually cover. Shops can provide menus and visitor details; contractors can list job types, travel limits, and what you need to prepare an estimate. GulfCDD works remotely from Biloxi.",
  biloxi: "Tell us whether your site mainly helps residents, visitors planning a trip, or both. Menus, current hours, booking requests, service coverage, and quote forms answer different questions; we can help decide what belongs on the page.",
  gulfport: "List which services need their own explanation, what locations you serve, and which requests go to different people. That helps plan Gulfport service pages and forms that collect useful details up front.",
  "new-orleans": "For a New Orleans website, tell us whether customers mainly need to book, check event or visitor details, compare a professional service, or request an estimate. Share the real service area and the questions customers ask before they contact you. GulfCDD handles the project remotely from Biloxi.",
  pascagoula: "For trade and service work, explain the jobs you take, the information needed for an estimate, and where inquiries should go. Share real project photos and credentials you are authorized to publish.",
  gautier: "Write down where you take jobs, including any travel limits outside Gautier. We can make that coverage clear without creating fake office locations or leaving customers guessing whether you serve their address.",
  diberville: "For a storefront, confirm hours, directions, and what customers can arrange before visiting. For a service business, identify the details you need in a quote request so the first follow-up is useful.",
  "long-beach": "Think about what a newly referred customer needs to check: the work you do, when you are available, and how to reach you. Your current website and a short list of missing information are enough to start the conversation.",
  "bay-st-louis": "For a shop, restaurant, artist, or hospitality business, tell us which details change with your schedule. We can discuss how to present availability, booking requests, and current information without adding tools you do not need.",
};

export function LocalProjectQuestions({ slug }: { slug: string }) {
  const text = localQuestions[slug];
  if (!text) return null;
  return (
    <aside className="mt-7 rounded-xl border border-white/15 bg-neutral-900 p-6 text-white">
      <h3 className="mb-3 font-heading text-lg font-bold">What should you send us first?</h3>
      <p className="text-sm leading-relaxed text-neutral-300">{text}</p>
      <p className="mt-4 text-sm leading-relaxed text-neutral-300">
        Plans are monthly and the same in every city: Essential is $150, Growth is $500 ($250 founding), and Full Service is $1,000 ($500 founding). Founding clients get the build free through January 31, 2027. Every plan includes an analytics report. No contract.
        {" "}<a href="/pricing/" className="font-semibold text-white underline underline-offset-4">Compare the website plans</a>
        {" "}or{" "}<a href="/what-we-build/" className="font-semibold text-white underline underline-offset-4">see what we can build for your business</a>.
      </p>
    </aside>
  );
}
