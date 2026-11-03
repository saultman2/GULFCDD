export function WebsiteCostGuide() {
  return (
    <section aria-labelledby="website-costs" className="border-y border-white/10 bg-neutral-950 py-12 md:py-16 text-white">
      <div className="container mx-auto max-w-5xl px-4 md:px-6">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">Know what you’re paying for</p>
        <h2 id="website-costs" className="mb-5 text-2xl font-heading font-extrabold md:text-3xl">What are you paying for?</h2>
        <p className="max-w-3xl leading-relaxed text-neutral-300">
          Plans are monthly, with no contract. Essential is $150 for hosting and upkeep. Growth is $500, or $250 for founding clients, and adds local SEO and blog posts. Full Service is $1,000, or $500 for founding clients. Every plan includes an analytics report. Founding clients get the website build free through January 31, 2027.
        </p>
        <div className="my-8 grid gap-5 md:grid-cols-3">
          {[
            ["1. Essential", "Essential is $150 a month for hosting and upkeep. It includes a monthly analytics report. Month to month, no contract."],
            ["2. Growth", "Growth is $500 a month, or $250 a month for founding clients. It adds local SEO and blog posts, and includes a monthly analytics report. No contract."],
            ["3. Full Service", "Full Service is $1,000 a month, or $500 a month for founding clients. It includes a monthly analytics report. No contract. Founding clients on every plan get the build free through January 31, 2027."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-xl border border-white/15 bg-white/5 p-6">
              <h3 className="mb-3 font-bold">{title}</h3>
              <p className="text-sm leading-relaxed text-neutral-300">{text}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-8 text-sm leading-relaxed md:grid-cols-2">
          <div>
            <h3 className="mb-2 font-bold text-base">What does a starting price cover?</h3>
            <p className="text-neutral-300">Essential is $150 a month. Growth is $500 a month, or $250 for founding clients. Full Service is $1,000 a month, or $500 for founding clients. Founding clients get the website build free through January 31, 2027. Every plan includes an analytics report, and you can cancel anytime.</p>
            <h3 className="mb-2 mt-6 font-bold text-base">Do I have to sign a contract?</h3>
            <p className="text-neutral-300">No. You pay month to month and can cancel anytime.</p>
          </div>
          <div>
            <h3 className="mb-2 font-bold text-base">Who owns the finished work?</h3>
            <p className="text-neutral-300">You keep ownership of the content you supply. Custom design elements and content created for your project transfer to you after full payment. Third-party licenses and our pre-existing tools remain subject to their own terms.</p>
            <h3 className="mb-2 mt-6 font-bold text-base">Can I cancel ongoing care?</h3>
            <p className="text-neutral-300">Yes. No contracts. Cancel anytime. Our monthly care plans have no minimum commitment or advance-notice requirement.</p>
          </div>
        </div>
        <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold">
          <a href="/membership/" className="underline underline-offset-4 hover:text-accent">Compare hosting and care</a>
          <a href="/terms/" className="underline underline-offset-4 hover:text-accent">Read the full service terms</a>
          <a href="/intake/?mode=quick" className="underline underline-offset-4 hover:text-accent">Ask for an itemized quote</a>
        </div>
      </div>
    </section>
  );
}
