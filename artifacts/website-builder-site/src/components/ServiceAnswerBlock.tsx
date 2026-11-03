import { ArrowRight, CheckCircle2 } from "lucide-react";

interface ServiceAnswerBlockProps {
  eyebrow: string;
  title: string;
  answer: string;
  points: string[];
  relatedHref: string;
  relatedLabel: string;
}

export function ServiceAnswerBlock({
  eyebrow,
  title,
  answer,
  points,
  relatedHref,
  relatedLabel,
}: ServiceAnswerBlockProps) {
  return (
    <section className="py-20 bg-white border-t border-slate-200">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        <div className="grid md:grid-cols-[1.05fr_0.95fr] gap-10 items-start">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-accent mb-4">{eyebrow}</span>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-primary leading-tight mb-5">{title}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{answer}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 md:p-7">
            <h3 className="font-heading font-bold text-primary mb-4">A good fit when you need to:</h3>
            <ul className="space-y-3">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  {point}
                </li>
              ))}
            </ul>
            <a href={relatedHref} className="inline-flex items-center gap-2 mt-6 text-sm font-bold text-accent hover:text-primary transition-colors">
              {relatedLabel} <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
