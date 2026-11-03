import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { useSEO } from "@/hooks/useSEO";

export default function ContactThanksPage() {
  useSEO({
    title: "Message received | GulfCDD",
    description: "Your message has been received by Gulf Coast Digital Designs.",
    canonical: "https://www.gulfcdd.com/contact/thanks/",
    noindex: true,
  });
  return <div className="flex min-h-screen flex-col">
    <Header />
    <main className="container mx-auto flex-1 px-4 py-20 md:px-6">
      <h1 className="mb-5 text-4xl font-bold">Thanks for getting in touch.</h1>
      <p className="max-w-2xl text-lg leading-relaxed">Your message has been sent to Gulf Coast Digital Designs. We’ll review your details and reply using the contact information you provided.</p>
      <a className="mt-8 inline-block text-accent underline" href="/">Return to the homepage</a>
    </main>
    <Footer />
  </div>;
}
