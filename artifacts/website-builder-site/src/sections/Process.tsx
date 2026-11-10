import { Smartphone } from "lucide-react";

export function Process() {
  const steps = [
    {
      num: "1",
      title: "Tell us what you need",
      desc: "Tell us what you do, send your current website if you have one, and explain what you want to change. You don't need a finished plan. We'll ask questions and put the work and cost in writing.",
    },
    {
      num: "2",
      title: "We build the first version",
      desc: "We use your business details, photos, and agreed content to build the site. If there are pages or features you like on your current website, tell us so we can plan to keep them.",
    },
    {
      num: "3",
      title: "You look it over",
      desc: "You'll get a preview before anything goes live. Read it as a customer would: are the services right, is the phone number correct, and can someone send you an inquiry? Let us know what needs adjusting.",
    },
    {
      num: "4",
      title: "We go live",
      desc: "After your approval and the final checks, we publish the website. We'll confirm the hosting arrangement and any domain changes with you first.",
    },
    {
      num: "5",
      title: "Choose your ongoing care",
      desc: "Want someone to handle hosting and future changes? We offer monthly support. Prefer your own provider? That's an option too. Your quote explains who handles each job after launch.",
    },
  ];

  return (
    <section id="process" className="py-24 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 -z-20">
        <img
          src="/images/gulf-coast-beach-walkers.webp"
          alt="People walking along a Mississippi Gulf Coast beach"
          width={1920}
          height={1080}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-white/75" />

      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        <div className="max-w-3xl mb-14">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-primary mb-5 leading-tight">
            Simple from the first message to launch.
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed font-medium">
            We agree on the scope, build a preview, review it with you, and launch after approval. Here is what happens at each step.
          </p>
        </div>

        <div className="space-y-4 mb-16">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="flex gap-5 md:gap-8 items-start bg-white/95 border border-slate-200 rounded-xl p-6 md:p-8 hover:border-accent/40 hover:shadow-md transition-all"
            >
              <div className="font-heading font-extrabold text-4xl md:text-5xl text-primary/10 shrink-0 w-12 md:w-16 pt-1">
                {step.num}
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-600 leading-relaxed font-medium">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile design callout */}
        <div
          className="bg-primary rounded-2xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center gap-6 md:gap-10"
        >
          <div className="shrink-0 w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
            <Smartphone className="w-8 h-8 text-accent" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-heading font-bold mb-2">
              Mobile-friendly design is part of every build.
            </h3>
            <p className="text-white/75 leading-relaxed font-medium text-[15px]">
              Customers should be able to read your services, use a form, and find your phone number on a small screen. We check mobile layouts before launch, including navigation, text, images, and contact actions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
