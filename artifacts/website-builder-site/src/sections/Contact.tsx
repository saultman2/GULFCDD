import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowRight } from "lucide-react";
import { fireEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { isMathChallengeCorrect, MathChallenge } from "@/components/MathChallenge";
import { QuickContact } from "@/sections/QuickContact";
import { FormHoneypot } from "@/components/FormHoneypot";

const formSchema = z.object({
  name: z.string().trim().min(2, "Please add your name"),
  email: z.string().trim().email("Please add a valid email address"),
  phone: z
    .string()
    .trim()
    .optional()
    .refine((v) => {
      if (!v) return true;
      const digits = v.replace(/\D/g, "").length;
      return digits >= 10 && digits <= 15;
    }, "Phone numbers need 10 to 15 digits, or leave this blank"),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const inputCls =
  "h-12 bg-white border-slate-300 font-medium text-foreground focus-visible:ring-accent";
const labelCls = "text-primary font-semibold";
const optional = <span className="ml-1 text-xs font-medium text-slate-400">optional</span>;

export function Contact({ showQuickLinks = true }: { showQuickLinks?: boolean }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mathAnswer, setMathAnswer] = useState("");
  const [mathError, setMathError] = useState("");
  const [, setLocation] = useLocation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });

  async function onSubmit(values: FormValues, event?: React.BaseSyntheticEvent) {
    if (!isMathChallengeCorrect(mathAnswer)) {
      setMathError("Please answer 2 to continue.");
      return;
    }
    setMathError("");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: values.phone?.trim() ?? "",
          message: values.message?.trim() ?? "",
          preferredContact: "email",
          company_website: new FormData(event?.target as HTMLFormElement).get("company_website") ?? "",
        }),
      });
      if (!res.ok) throw new Error("Server error");
      fireEvent("generate_lead", { method: "contact_form" }); // fires once; /thank-you is presentation-only
      form.reset();
      setLocation("/contact/thanks/");
    } catch {
      toast({
        title: "Your message didn't send",
        description: "Please try again, or email us directly at aultman@gulfcoastdigitaldesign.com.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="py-16 md:py-24 relative bg-slate-50/50">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <div className="mb-8">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-primary mb-3 leading-tight">
            Talk to the people building it.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed font-medium">
            Email, text, or call us. Or leave a quick note below and we'll write back.
          </p>
        </div>

        {showQuickLinks && <QuickContact />}

        <div className="flex items-center gap-4 mb-6" aria-hidden="true">
          <span className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">or send a note</span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="bg-white border border-slate-200 border-t-2 border-t-accent rounded-xl p-5 sm:p-8 shadow-lg shadow-black/10">
          <Form {...form}>
            <form action="/api/contact" method="post" onSubmit={form.handleSubmit(onSubmit)} className="gcd-form space-y-5" aria-label="Quick contact form" noValidate>
              <FormHoneypot />
              <div className="grid md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelCls}>Your name</FormLabel>
                      <FormControl>
                        <Input required autoComplete="name" placeholder="Jordan Lee" className={inputCls} {...field} data-testid="input-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelCls}>Email</FormLabel>
                      <FormControl>
                        <Input required type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" className={inputCls} {...field} data-testid="input-email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelCls}>Phone {optional}</FormLabel>
                    <FormControl>
                      <Input type="tel" inputMode="tel" autoComplete="tel" placeholder="(228) 555-0142" className={inputCls} {...field} data-testid="input-phone" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelCls}>What's on your mind? {optional}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A sentence or two is plenty. What does your business do, and what would you like help with?"
                        className="bg-white border-slate-300 font-medium text-foreground min-h-[110px] focus-visible:ring-accent"
                        {...field}
                        data-testid="input-message"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <MathChallenge
                id="contact-math-challenge"
                value={mathAnswer}
                error={mathError}
                onChange={(value) => {
                  setMathAnswer(value);
                  if (isMathChallengeCorrect(value)) setMathError("");
                }}
              />

              <Button
                type="submit"
                size="lg"
                className="group w-full bg-accent hover:bg-accent/90 text-white rounded-md h-14 text-lg font-bold shadow-md focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                aria-busy={isSubmitting}
                disabled={isSubmitting}
                data-testid="button-submit-contact"
              >
                {isSubmitting ? "Sending" : (
                  <span className="inline-flex items-center gap-2">
                    Send message <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                )}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                We'll reply by email. You don't need a full project brief to get in touch.
              </p>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
