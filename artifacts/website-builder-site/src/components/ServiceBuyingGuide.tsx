const guides = {
  design: {
    title: "Planning a new website or a redesign?",
    questions: [
      ["Can you keep the parts of my current site that work?", "Yes. Start by sending your current URL and explaining what is frustrating customers. We can discuss a focused improvement or a redesign, while planning how to preserve useful pages, working links, and content you want to keep."],
      ["What affects the quote?", "Plans are monthly with no contract. Essential is $150 a month for hosting and upkeep. Growth is $500 a month, or $250 for founding clients, and adds local SEO and blog posts. Full Service is $1,000 a month, or $500 for founding clients. Founding clients get the build free through January 31, 2027. Every plan includes an analytics report."],
      ["What should I bring to the first conversation?", "Your website address if you have one, a list of services, your logo, and a few examples of what customers ask. Photos you have permission to use and your preferred way to receive inquiries are helpful too."],
    ],
  },
  development: {
    title: "Work out the process before building the software.",
    questions: [
      ["Do I need a custom application or a simpler website feature?", "Describe the task first. A quote form or booking link may be enough. A client portal, estimator, or internal application makes sense when people need to do more than read a page or send a message."],
      ["What affects development cost and timing?", "The steps in the workflow, user permissions, data involved, and outside systems we need to connect. Payment, calendar, or other integrations depend on the provider’s capabilities and account access. We confirm those requirements before quoting."],
      ["How do we check that the feature works?", "We agree on what should happen when someone submits, books, or pays, including what your team receives and what customers see if something fails. Those steps guide the build and testing before launch."],
    ],
  },
  seo: {
    title: "What happens when we work on your local SEO?",
    questions: [
      ["What do you review first?", "Your existing pages, business details, service coverage, and Google Business Profile. We look for unclear service information, broken paths to contact you, inconsistent listings, and technical issues that stop useful pages being found."],
      ["What is one-time setup versus ongoing work?", "Setup covers agreed page structure, titles, service details, and technical corrections. Ongoing work can include content updates, business-listing care, SEO improvements, and analytics reviews. Your quote states which work and reporting are included."],
      ["Can you guarantee a Google ranking or an AI recommendation?", "No. Google and AI platforms decide what they show. We make your services, location coverage, and real project evidence easier to understand, then review useful measures such as accepted inquiries and the pages people use—not just visits."],
      ["How long does local SEO take?", "Usually a few months before you see steady change, longer in busy markets like New Orleans. Your monthly report shows what's moving."],
    ],
  },
};

export function ServiceBuyingGuide({ service }: { service: keyof typeof guides }) {
  const guide = guides[service];
  return (
    <section className="border-t border-white/10 bg-neutral-950 py-12 md:py-16 text-white">
      <div className="container mx-auto max-w-4xl px-4 md:px-6">
        <h2 className="mb-6 text-2xl font-heading font-extrabold md:text-3xl">{guide.title}</h2>
        <div className="divide-y divide-white/15">
          {guide.questions.map(([question, answer]) => (
            <details key={question} className="group py-4" open>
              <summary className="cursor-pointer py-2 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">{question}</summary>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-neutral-300">{answer}</p>
            </details>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold">
          <a href="/pricing/" className="underline underline-offset-4 hover:text-accent">Compare website plans</a>
          <a href="/what-we-build/" className="underline underline-offset-4 hover:text-accent">See what we build</a>
          <a href="/contact/" className="underline underline-offset-4 hover:text-accent">Discuss your project</a>
        </div>
      </div>
    </section>
  );
}
