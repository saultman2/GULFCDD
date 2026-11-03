import blogMeta from './blog-meta.json';

/** Look up a post's publish date from the shared blog-meta.json source. */
const d = (slug: string): string =>
  (blogMeta as { slug: string; date: string }[]).find(m => m.slug === slug)?.date ?? '';

export type Block =
  | { type: "p"; html: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "faq"; question: string; answerHtml: string }
  | { type: "ul"; items: string[] }
  | { type: "callout"; html: string };

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  metaTitle: string;
  metaDescription: string;
  blocks: Block[];
}

export const posts: BlogPost[] = [
  {
    slug: "website-cost-mississippi",
    title: "How Much Does a Website Cost for a Small Business in Mississippi?",
    excerpt:
      "The honest answer depends on what you actually need. Here's a real breakdown of website pricing in Mississippi — from DIY builders to custom builds — so you can make a smart decision for your business.",
    date: d("website-cost-mississippi"),
    readTime: "6 min read",
    category: "Pricing & Planning",
    metaTitle:
      "How Much Does a Website Cost in Mississippi? | GulfCDD Pricing Guide",
    metaDescription:
      "Wondering what a website costs for your Mississippi small business? We break down real pricing for DIY builders, freelancers, and local agencies — with no fluff. Free quote from GulfCDD.",
    blocks: [
      {
        type: "p",
        html: "It's one of the most common questions we hear: <em>How much should I actually expect to pay for a website?</em> We get it — the answer you find online is almost always \"it depends,\" which isn't all that useful. So here's the real breakdown. The price range for a small business website in Mississippi is wide, and the reason is that different options deliver genuinely different results.",
      },
      { type: "h2", text: "Option 1: DIY Website Builders (Wix, Squarespace, GoDaddy)" },
      {
        type: "p",
        html: "Monthly cost: <strong>$12–$45/month</strong> (plus your time).",
      },
      {
        type: "p",
        html: "Builders like Wix and Squarespace make a lot of sense for a personal portfolio or a hobby project. For a small business that needs to rank on Google and turn visitors into customers, though, they start showing their limits pretty quickly. The templates are the same ones thousands of other businesses are using. The SEO tools are basic. Pages can load slowly. And while you're fiddling with a drag-and-drop editor, you're not running your business.",
      },
      {
        type: "p",
        html: "That said, if you just need a simple one-page presence and you have the time to build and maintain it yourself, starting with a builder is a perfectly reasonable move. Just go in knowing that consistent Google leads probably aren't coming from it.",
      },
      { type: "h2", text: "Option 2: Freelance Web Designer" },
      {
        type: "p",
        html: "One-time cost: <strong>$500–$3,000</strong> (varies widely by experience).",
      },
      {
        type: "p",
        html: "Hiring a freelancer gets you a real person building something specific to your business — and that matters. The quality depends entirely on who you hire. An experienced designer who understands local SEO can build you something genuinely solid. A newer designer working for $300 might hand you a good-looking site that never ranks for anything.",
      },
      {
        type: "p",
        html: "The other thing to keep in mind with freelancers is availability. Many work solo, which means if something breaks six months after launch, you might be waiting a while on a response while your contact form sits dead.",
      },
      { type: "h2", text: "Option 3: National or Out-of-State Agency" },
      {
        type: "p",
        html: "One-time cost: <strong>$3,000–$15,000+</strong>.",
      },
      {
        type: "p",
        html: "Large agencies build professional sites, no question. But you're also paying for their overhead, their account managers, and their New York or Austin zip code. Most small businesses on the Gulf Coast don't need a $10,000 website. And honestly, these agencies rarely know your local market — they don't know what \"near Keesler AFB\" or \"off Highway 90\" means to your customers.",
      },
      { type: "h2", text: "Option 4: Local Gulf Coast Agency (Like Us)" },
      {
        type: "p",
        html: "We don't publish a price list online because every project is genuinely different — a five-page service site has different needs than an e-commerce store. What we can tell you is that we work with small businesses across the Gulf Coast and our pricing reflects what those businesses can actually afford, not what a national agency would charge.",
      },
      {
        type: "p",
        html: "What you get from <a href='/about/' class='text-accent hover:underline font-semibold'>Gulf Coast Digital Designs</a>: a custom-built site (no templates), on-page SEO baked in from day one, a team that picks up the phone or replies to a text, and maintenance options so you're not on your own after launch. We're veteran-owned and based in Biloxi — this is our community too.",
      },
      { type: "h2", text: "What Affects the Price?" },
      {
        type: "ul",
        items: [
          "Number of pages — a 5-page site costs less than a 20-page site",
          "E-commerce — online stores require significantly more build time",
          "Custom features — booking systems, calculators, client portals add cost",
          "Photography — professional photos increase quality and price",
          "Ongoing maintenance — monthly care plans add a predictable monthly cost",
          "Copywriting — whether you write your own content or hire someone to write it",
        ],
      },
      {
        type: "callout",
        html: "The cheapest option isn't always the most affordable in the long run. A $500 site that generates zero leads and needs to be rebuilt in two years costs more than a $2,000 site that ranks on Google and brings in a steady stream of calls.",
      },
      { type: "h2", text: "So What Should You Budget?" },
      {
        type: "p",
        html: "For a professional small business website in Mississippi that's built to rank on Google, a realistic budget is $1,500–$4,000 for the build, plus an optional monthly care plan if you want ongoing support. This applies whether you're a contractor in <a href='/service-areas/gulfport/' class='text-accent hover:underline font-semibold'>Gulfport</a>, a restaurant in <a href='/service-areas/biloxi/' class='text-accent hover:underline font-semibold'>Biloxi</a>, or a service business anywhere on the Coast.",
      },
      {
        type: "p",
        html: "The best way to figure out what your specific project would cost is to <a href='/contact/' class='text-accent hover:underline font-semibold'>reach out for a free quote</a>. No commitment, no sales pitch — just a straight answer about what we'd build and what it costs.",
      },
    ],
  },

  {
    slug: "why-gulf-coast-business-needs-website",
    title: "5 Reasons Every Gulf Coast Business Needs a Website",
    excerpt:
      "Referrals and Facebook can help a business get started, but a website gives Gulf Coast customers one reliable place to find your services, check your details, and contact you.",
    date: d("why-gulf-coast-business-needs-website"),
    readTime: "5 min read",
    category: "Business Growth",
    metaTitle:
      "5 Reasons Every Gulf Coast Business Needs a Website | GulfCDD",
    metaDescription:
      "Not sure if your Ocean Springs or Biloxi small business needs a website? Here are 5 reasons Gulf Coast businesses that invest in a professional website outcompete those that don't.",
    blocks: [
      {
        type: "p",
        html: "A website gives a Mississippi Gulf Coast business a home base that it controls. It explains what you do, shows where you work, answers the questions customers ask before calling, and gives Google something useful to understand. Facebook and referrals still matter, but they work better when they lead people to a clear, trustworthy website.",
      },
      { type: "h2", text: "1. Customers look you up before they contact you" },
      {
        type: "p",
        html: "When someone hears about a contractor, restaurant, salon, or professional service from a friend, the next step is often a quick search. They want to see your services, service area, hours, photos, reviews, and a way to reach you. That happens in <a href='/service-areas/ocean-springs/' class='text-accent hover:underline font-semibold'>Ocean Springs</a> just as it does in <a href='/service-areas/biloxi/' class='text-accent hover:underline font-semibold'>Biloxi</a>, <a href='/service-areas/gulfport/' class='text-accent hover:underline font-semibold'>Gulfport</a>, and the surrounding Coast.",
      },
      {
        type: "p",
        html: "A Google Business Profile is important, but it is not a complete website. Your site gives customers the fuller picture and gives local search engines a crawlable source for your business name, services, locations, and contact details.",
      },
      { type: "h2", text: "2. Your website keeps working after business hours" },
      {
        type: "p",
        html: "You cannot answer every call while you are on a job, closing the shop, or spending the day outside. A good small-business website handles the first questions for you: what you offer, where you go, how much lead time you need, and how someone can request an estimate.",
      },
      {
        type: "p",
        html: "That matters for Gulf Coast service businesses in particular. A contractor may be working at a customer's house when a storm-damage inquiry comes in. A clear quote form can collect the address, project type, timeline, and photos so the conversation starts with useful information instead of a missed call.",
      },
      { type: "h2", text: "3. A clear website supports local SEO" },
      {
        type: "p",
        html: "Local SEO is the work of helping the right nearby customer find and understand your business. A well-structured website supports that work with descriptive page titles, useful service pages, location details, internal links, and content that answers real customer questions.",
      },
      {
        type: "p",
        html: "For example, a web designer serving <a href='/service-areas/pascagoula/' class='text-accent hover:underline font-semibold'>Pascagoula</a> can explain web design for Jackson County businesses. A restaurant in Ocean Springs can highlight its menu, hours, parking, and reservation process. Specific information is more useful than repeating “Gulf Coast” in every paragraph.",
      },
      {
        type: "p",
        html: "Our <a href='/services/seo/' class='text-accent hover:underline font-semibold'>local SEO service</a> focuses on those practical foundations: accurate business information, page structure, Google Business Profile support, useful content, and a site that makes it easy to take the next step.",
      },
      {
        type: "p",
        html: "For the bigger picture, read our <a href='/blog/gulf-coast-digital-marketing-seo-geo-guide/' class='text-accent hover:underline font-semibold'>guide to digital marketing, SEO, AEO, and GEO for Gulf Coast businesses</a>.",
      },
      { type: "h2", text: "4. A website gives customers more confidence" },
      {
        type: "p",
        html: "Hiring a local business involves trust. Customers want to know who they are dealing with, whether the business is established, and what the experience will be like. A professional website can show real work, explain the process, answer common concerns, and make the business feel reachable before the first conversation.",
      },
      {
        type: "p",
        html: "This is especially important for businesses that work in someone's home, handle a high-value project, or serve visitors who are new to the area. A customer in Biloxi may compare several businesses in a few minutes. Clear information and an easy-to-use site give them a reason to keep considering you.",
      },
      { type: "h2", text: "5. You own the customer's first impression" },
      {
        type: "p",
        html: "Social platforms change their feeds, layouts, and reach. A referral can get someone interested, but your website is where you can control the explanation. You decide which services to feature, how your work is presented, what customers should do next, and which questions deserve a full answer.",
      },
      {
        type: "p",
        html: "You do not need a huge website to make that first impression. A focused five-page site with strong photos, honest copy, service details, reviews, and a working contact form can be more useful than a large site full of vague marketing language.",
      },
      {
        type: "callout",
        html: "The best website for a Gulf Coast small business is not the biggest one. It is the one that answers the customer's questions clearly and makes the next step easy.",
      },
      { type: "h2", text: "Common questions about small-business websites" },
      {
        type: "h3",
        text: "Do I need a website if I already have a Google Business Profile?",
      },
      {
        type: "p",
        html: "Yes. A Google Business Profile helps customers find your listing, while your website gives them the detailed information that helps them choose and contact you. The two work best together.",
      },
      {
        type: "h3",
        text: "How many pages does a small business website need?",
      },
      {
        type: "p",
        html: "Most small businesses can start with a home page, services page, about page, contact page, and one location or service page when it adds genuinely useful information. Add pages when they answer a distinct customer question, not just to create more URLs.",
      },
      {
        type: "h3",
        text: "What should a Gulf Coast business put on its website?",
      },
      {
        type: "p",
        html: "At minimum, include your services, service area, hours, phone number, contact method, real photos, customer proof, and a clear explanation of what happens after someone reaches out. Businesses serving multiple cities should describe those markets accurately rather than copying the same paragraph for each city.",
      },
      {
        type: "p",
        html: "If your current site is outdated, slow, or difficult to update, <a href='/contact/' class='text-accent hover:underline font-semibold'>contact Gulf Coast Digital Designs for a free quote</a>. We build custom websites and local SEO foundations for businesses from Bay St. Louis to Pascagoula.",
      },
    ],
  },

  {
    slug: "google-business-profile-mississippi",
    title: "Google Business Profile Setup Guide for Mississippi Small Businesses",
    excerpt:
      "Your Google Business Profile is the most powerful free tool available to local businesses — and most Gulf Coast business owners haven't fully set it up. Here's the step-by-step.",
    date: d("google-business-profile-mississippi"),
    readTime: "7 min read",
    category: "Local SEO",
    metaTitle:
      "Google Business Profile Setup Guide for Mississippi Businesses | GulfCDD",
    metaDescription:
      "Step-by-step guide to setting up and optimizing your Google Business Profile for Ocean Springs, Biloxi, Gulfport, and other Mississippi Gulf Coast small businesses. Rank in local search for free.",
    blocks: [
      {
        type: "p",
        html: "When someone searches \"web designer near me\" or \"HVAC contractor Biloxi MS,\" the results they see first are usually the map pack — three businesses with star ratings, a phone number, and a link to their website. That real estate is controlled by Google Business Profile (formerly Google My Business), and it's completely free to set up. Yet most small businesses on the Gulf Coast either haven't claimed theirs or left it half-finished and moved on.",
      },
      {
        type: "p",
        html: "Here's how to set it up right. This applies whether you're in <a href='/service-areas/ocean-springs/' class='text-accent hover:underline font-semibold'>Ocean Springs</a>, <a href='/service-areas/biloxi/' class='text-accent hover:underline font-semibold'>Biloxi</a>, <a href='/service-areas/gulfport/' class='text-accent hover:underline font-semibold'>Gulfport</a>, <a href='/service-areas/pascagoula/' class='text-accent hover:underline font-semibold'>Pascagoula</a>, or anywhere else on the Mississippi Gulf Coast.",
      },
      { type: "h2", text: "Step 1: Claim or Create Your Profile" },
      {
        type: "p",
        html: "Go to <strong>business.google.com</strong> and sign in with a Google account. Search for your business name. If it already exists — Google sometimes auto-creates listings — claim it. If not, click \"Add your business\" and follow the prompts.",
      },
      {
        type: "p",
        html: "Google will need to verify you're the actual owner, usually by mailing a postcard with a PIN to your business address. Some businesses can verify by phone or email instead. If you need a postcard, budget 1–2 weeks for it to arrive.",
      },
      { type: "h2", text: "Step 2: Fill Out Every Field — Completely" },
      {
        type: "p",
        html: "This is the step most people rush through. Google uses the completeness of your profile as a ranking signal, so finishing it matters. Work through every section:",
      },
      {
        type: "ul",
        items: [
          "Business name — exactly as it appears on your signage and website",
          "Category — choose the most specific primary category that fits (e.g., 'Web Designer' not just 'Business')",
          "Address — if you serve customers at your location; if you work from home, you can hide the address and just list your service area",
          "Service area — list every city you serve (Ocean Springs, Biloxi, Gulfport, Pascagoula, etc.)",
          "Phone number — use a local number, not a toll-free number",
          "Website URL — this is critical; Google uses your website to understand your business",
          "Hours — including holiday hours",
          "Description — 750 characters to describe what you do; mention your city and key services naturally",
          "Services — add each service you offer individually",
          "Attributes — veteran-owned, women-owned, etc. Use whatever applies",
        ],
      },
      { type: "h2", text: "Step 3: Add Photos — Real Ones" },
      {
        type: "p",
        html: "Businesses with photos get significantly more clicks and direction requests than those without. Try to add:",
      },
      {
        type: "ul",
        items: [
          "A cover photo (your best work or your storefront)",
          "A logo",
          "Interior and exterior photos if you have a physical location",
          "Photos of your work, products, or team",
          "At least 10 photos to start",
        ],
      },
      {
        type: "p",
        html: "Stock photos hurt more than they help here — Google can detect them, and customers can tell. Use real photos of your actual business. Even phone photos are better than stock.",
      },
      { type: "h2", text: "Step 4: Get Reviews — and Respond to All of Them" },
      {
        type: "p",
        html: "Reviews are one of the most powerful ranking factors in local search. The number of reviews, the overall star rating, and how recently they were posted all factor into where you appear in the map pack.",
      },
      {
        type: "p",
        html: "After completing a job, just ask: <em>\"Would you mind leaving us a Google review? It really does help us.\"</em> Then send them a direct link to your review page — you can find it in the Google Business dashboard under \"Get more reviews.\"",
      },
      {
        type: "p",
        html: "Respond to every review, positive and negative. Google notices that you're engaged, and potential customers see that you care about the people who hire you.",
      },
      { type: "h2", text: "Step 5: Post Updates Regularly" },
      {
        type: "p",
        html: "Google Business Profile has a Posts feature — similar to a social media post — that shows up directly in your listing. Post at least once a week: a project you finished, a seasonal offer, a tip for customers, a before-and-after. Profiles that stay active tend to rank better and stay more visible over time.",
      },
      { type: "h2", text: "Pair Your GBP with a Real Website" },
      {
        type: "p",
        html: "A fully optimized Google Business Profile is powerful on its own, but it works best when it's backed by a solid website. Google cross-references your site content when deciding where to rank your profile. A site that clearly mentions your city, your services, and your service area reinforces everything your GBP says.",
      },
      {
        type: "p",
        html: "That's what our <a href='/services/seo/' class='text-accent hover:underline font-semibold'>local SEO service</a> is built around: making your entire online presence — website and GBP together — work as a system. If you'd like help with either, <a href='/contact/' class='text-accent hover:underline font-semibold'>reach out and we'll talk through it</a>.",
      },
    ],
  },

  {
    slug: "website-builder-vs-custom-website",
    title: "Website Builder vs. Custom Website: What's Right for Your Gulf Coast Business?",
    excerpt:
      "Wix, Squarespace, and GoDaddy make it look easy. And for some use cases, they're fine. But if your goal is to rank on Google and generate leads, here's what you need to know before choosing.",
    date: d("website-builder-vs-custom-website"),
    readTime: "6 min read",
    category: "Web Design",
    metaTitle:
      "Website Builder vs Custom Website for Gulf Coast Businesses | GulfCDD",
    metaDescription:
      "Should your Gulf Coast small business use Wix, Squarespace, or a custom-built website? We compare real pros and cons so you can make the right call for your budget and growth goals.",
    blocks: [
      {
        type: "p",
        html: "The pitch for website builders is simple: drag, drop, done. Pick a template, swap in your logo, add some photos, and you're live — for $20 a month. It sounds like the obvious move for a small business on a budget. Sometimes it is. But before you commit, it's worth understanding what you're actually getting.",
      },
      { type: "h2", text: "What Website Builders Actually Are" },
      {
        type: "p",
        html: "Wix, Squarespace, Weebly, GoDaddy Website Builder — these are template-based tools hosted on their own servers. You don't own the underlying code. You're renting space on their platform. When you cancel, your site goes with it.",
      },
      {
        type: "p",
        html: "The templates look sharp in screenshots. But walk around any business district in <a href='/service-areas/biloxi/' class='text-accent hover:underline font-semibold'>Biloxi</a> or <a href='/service-areas/gulfport/' class='text-accent hover:underline font-semibold'>Gulfport</a> and you'll start to recognize them: the same layouts, the same button styles, the same photo placement. There's nothing that says <em>this specific business</em>.",
      },
      { type: "h2", text: "The Real Limitations of Website Builders" },
      {
        type: "ul",
        items: [
          "SEO ceiling — builders give you basic SEO fields but limit how deep you can go. Page speed (a direct Google ranking factor) often suffers because of extra code these platforms load.",
          "No real local keyword strategy — a template doesn't know you serve Ocean Springs or Pascagoula. You have to build that targeting in yourself, and most business owners don't know how.",
          "You look like everyone else — templates are designed to be generic enough to work for any business, which means they're optimized for no business in particular.",
          "Hidden costs add up — the base plan often doesn't include everything you actually need. E-commerce, custom domains, removing builder branding, and app integrations can push costs higher than expected.",
          "You're on your own — when something breaks or you need a new feature, you're searching help forums for answers.",
        ],
      },
      { type: "h2", text: "When a Builder Is the Right Call" },
      {
        type: "p",
        html: "To be fair, website builders are genuinely the right choice in some situations:",
      },
      {
        type: "ul",
        items: [
          "You're testing a business idea and need a placeholder site quickly",
          "You don't expect to get leads from Google — your business runs entirely on referrals or social media",
          "You have a very simple presence: one page, contact info, maybe a menu",
          "Budget is tight and you're willing to trade performance for a low upfront cost",
        ],
      },
      {
        type: "p",
        html: "If any of those describe you, a builder might be perfectly fine for now. You can always upgrade later when the business grows into needing more.",
      },
      { type: "h2", text: "When a Custom Website Is Worth It" },
      {
        type: "p",
        html: "Custom sites make sense when you want your website to actually do something — drive phone calls, generate form submissions, rank in Google for local searches, build trust with customers who find you cold.",
      },
      {
        type: "ul",
        items: [
          "You want to rank for 'web designer Ocean Springs MS' or '[your service] [your city] MS'",
          "You serve multiple cities and want a dedicated page for each one",
          "You want a site that loads fast and scores well on Google's Core Web Vitals",
          "You want design that reflects your specific brand, not a stock template",
          "You want a real person to call when something needs to change",
        ],
      },
      { type: "h2", text: "What 'Custom' Actually Means at GulfCDD" },
      {
        type: "p",
        html: "When we say custom, we mean built from scratch for your business — your services, your cities, your brand voice, your customers. On-page SEO is baked in from day one: title tags, meta descriptions, header structure, internal linking, local keyword targeting. We don't use page builders or templates that add extra code and slow your site down.",
      },
      {
        type: "p",
        html: "Our <a href='/services/design/' class='text-accent hover:underline font-semibold'>website design service</a> covers everything from initial design to launch, and our <a href='/pricing/' class='text-accent hover:underline font-semibold'>packages</a> are built around what Gulf Coast small businesses actually need and can afford. <a href='/contact/' class='text-accent hover:underline font-semibold'>Get a free quote</a> and we'll give you a straight answer about what we'd build for you.",
      },
    ],
  },

  {
    slug: "veteran-owned-web-design-mississippi",
    title: "Veteran-Owned Web Design in Mississippi: What It Means for Your Project",
    excerpt:
      "Gulf Coast Digital Designs is a veteran-owned web design agency based in Biloxi, Mississippi. Here's what that actually means when you hire us to build your site.",
    date: d("veteran-owned-web-design-mississippi"),
    readTime: "4 min read",
    category: "About GulfCDD",
    metaTitle:
      "Veteran-Owned Web Design Mississippi | Gulf Coast Digital Designs",
    metaDescription:
      "Gulf Coast Digital Designs is a veteran-owned web design agency based in Biloxi, MS. Here's what that means for your web project.",
    blocks: [
      {
        type: "p",
        html: "Gulf Coast Digital Designs is a veteran-owned web design agency based in <a href='/service-areas/biloxi/' class='text-accent hover:underline font-semibold'>Biloxi, Mississippi</a>. We started this business because we saw a gap: small businesses on the Gulf Coast were either overpaying national agencies that didn't understand the local market, or settling for DIY sites that weren't generating any leads. We figured we could do better.",
      },
      { type: "h2", text: "What Military Service Actually Teaches You About Running a Business" },
      {
        type: "p",
        html: "The military is, among other things, a crash course in accountability. When you say you'll have something done by a certain time, you have it done by that time. When something goes wrong, you figure out what happened, fix it, and make sure it doesn't happen again. There's no such thing as a half-delivered mission.",
      },
      {
        type: "p",
        html: "That's genuinely how we run web projects. When we tell you your site will be ready in three weeks, we mean it. When you text us about a content change, we don't leave you waiting a week. When something breaks after launch, we fix it — because that's just what you do.",
      },
      { type: "h2", text: "What It Means Practically for Your Project" },
      {
        type: "ul",
        items: [
          "We communicate clearly and consistently throughout the project — no going dark",
          "Deadlines we set are deadlines we meet",
          "We give you a straight answer, even when the straight answer isn't what you were hoping for",
          "We don't upsell you features you don't need",
          "We're reachable — by phone, email, or text — when you need us after launch",
        ],
      },
      { type: "h2", text: "We're Local Because It Matters" },
      {
        type: "p",
        html: "We live on the Gulf Coast. We shop at businesses like yours. We have a real stake in seeing this community do well. When you hire us to build your site in <a href='/service-areas/biloxi/' class='text-accent hover:underline font-semibold'>Biloxi</a> or <a href='/service-areas/gulfport/' class='text-accent hover:underline font-semibold'>Gulfport</a> or anywhere else on the Coast, you're hiring neighbors who understand what it actually takes to run a small business in this market.",
      },
      {
        type: "p",
        html: "Big agencies don't know that beach traffic peaks in summer and drops in winter. They don't know which zip codes are growing fastest or what keywords the competition is ranking for in Jackson County. We do — because we're here.",
      },
      { type: "h2", text: "Supporting Veteran-Owned Businesses" },
      {
        type: "p",
        html: "Choosing a veteran-owned business is an economic decision as much as anything else. The money stays local, it supports a family on the Gulf Coast, and it goes to people who take their word seriously.",
      },
      {
        type: "p",
        html: "If you'd like to work with us, <a href='/contact/' class='text-accent hover:underline font-semibold'>reach out for a free quote</a> or <a href='/about/' class='text-accent hover:underline font-semibold'>learn more about who we are</a>. No pressure — just a straight conversation about what we can build for your business.",
      },
    ],
  },

  {
    slug: "mississippi-gulf-coast-website-launch-checklist",
    title: "The Mississippi Gulf Coast Small Business Website Launch Checklist",
    excerpt:
      "A practical, no-jargon checklist for launching a small-business website that is easy to find, easy to use, and ready to turn Gulf Coast visitors into customers.",
    date: d("mississippi-gulf-coast-website-launch-checklist"),
    readTime: "8 min read",
    category: "Resources",
    metaTitle:
      "Mississippi Gulf Coast Small Business Website Launch Checklist | GulfCDD",
    metaDescription:
      "Use this practical website launch checklist for Mississippi Gulf Coast small businesses. Cover SEO, Google Business Profile, accessibility, speed, forms, and trust before launch.",
    blocks: [
      {
        type: "p",
        html: "Launching a business website is more than choosing colors and pressing publish. Before your site goes live, it should make it easy for customers across Ocean Springs, Biloxi, Gulfport, Pascagoula, and the rest of the Mississippi Gulf Coast to understand what you do, trust your business, and contact you.",
      },
      {
        type: "p",
        html: "Use this checklist as a final review for a new site or a practical audit of an existing one. Check every item you can, then fix the highest-impact gaps first.",
      },
      { type: "h2", text: "1. Business information is complete and consistent" },
      {
        type: "ul",
        items: [
          "Your exact business name, phone number, email address, and service area appear on the site.",
          "Your business information matches your Google Business Profile and other legitimate business listings.",
          "Your hours, holiday availability, and emergency or after-hours instructions are accurate.",
          "A customer can find your address or service area without guessing.",
          "The About page explains who runs the business and why customers should trust you.",
        ],
      },
      { type: "h2", text: "2. Each important service has a clear page" },
      {
        type: "p",
        html: "Do not put every service into one vague paragraph. Give important services their own page when customers search for them separately. A web designer, contractor, restaurant, or professional service should make the offer, service area, process, and next step obvious on each page.",
      },
      {
        type: "ul",
        items: [
          "The page has one clear headline that describes the service.",
          "The first paragraph says who the service is for and where it is offered.",
          "The page explains what is included, what happens next, and what makes the business different.",
          "A visible phone, email, form, or booking call-to-action appears near the top and bottom.",
          "Related services and relevant location pages are linked naturally.",
        ],
      },
      { type: "h2", text: "3. Local search foundations are in place" },
      {
        type: "p",
        html: "A website cannot replace a complete Google Business Profile, but the two should support each other. Make sure your site uses real location information naturally instead of repeating city names unnaturally on every page.",
      },
      {
        type: "ul",
        items: [
          "Your Google Business Profile is claimed and verified.",
          "The primary category and service list accurately describe the business.",
          "Real photos, recent updates, and customer reviews are present on the profile.",
          "The website links to the correct profile and the profile links to the correct website.",
          "Location pages contain useful local information rather than duplicated city-name swaps.",
        ],
      },
      {
        type: "p",
        html: "Our <a href='/blog/google-business-profile-mississippi/' class='text-accent hover:underline font-semibold'>Google Business Profile guide for Mississippi businesses</a> covers the profile side in more detail.",
      },
      { type: "h2", text: "4. The site works for every visitor" },
      {
        type: "ul",
        items: [
          "The site works on a phone, tablet, and desktop without horizontal scrolling.",
          "Text has sufficient contrast and can be read without zooming.",
          "Buttons and links have descriptive labels and comfortable tap targets.",
          "Images have useful alternative text when they communicate information.",
          "Forms have visible labels, clear error messages, and a success confirmation.",
          "Keyboard users can reach menus, forms, dialogs, and close buttons.",
        ],
      },
      { type: "h2", text: "5. Search engines can understand and crawl it" },
      {
        type: "ul",
        items: [
          "Every important page has a unique title and meta description.",
          "The site uses one descriptive H1 and a logical heading structure.",
          "The canonical URL uses HTTPS and the preferred www host.",
          "Robots.txt does not block important pages.",
          "The XML sitemap contains the canonical, indexable URLs.",
          "Broken links, placeholder text, and empty pages have been removed.",
          "Relevant pages link to one another using descriptive anchor text.",
        ],
      },
      {
        type: "p",
        html: "For a deeper planning reference, see our guide to <a href='/blog/website-cost-mississippi/' class='text-accent hover:underline font-semibold'>website costs for Mississippi small businesses</a> and our <a href='/services/seo/' class='text-accent hover:underline font-semibold'>local SEO services</a>.",
      },
      { type: "h2", text: "6. Speed, security, and reliability are tested" },
      {
        type: "ul",
        items: [
          "The site loads over HTTPS with a valid certificate.",
          "The largest images are compressed and served in modern formats.",
          "The homepage remains usable while analytics and chat tools load.",
          "The contact form works on both desktop and mobile.",
          "Confirmation emails arrive at the intended inbox.",
          "The domain, email, analytics, and Search Console ownership are verified.",
          "A backup and a way to make future content changes are documented.",
        ],
      },
      { type: "h2", text: "7. Trust and conversion details are visible" },
      {
        type: "ul",
        items: [
          "The site shows real work, testimonials, reviews, or examples where available.",
          "Pricing guidance or a clear explanation of the quote process is provided.",
          "The privacy policy and terms are easy to find.",
          "The site explains what happens after a visitor submits a form.",
          "The primary call-to-action is consistent across the site.",
          "Analytics records important actions without sending unnecessary personal information.",
        ],
      },
      { type: "h2", text: "The final pre-launch test" },
      {
        type: "p",
        html: "Open the site as if you were a first-time customer. Can you tell what the business does within five seconds? Can you find the service you need? Can you contact someone without hunting? Test the site from a phone on a normal connection, submit every important form, and ask one person who does not know the business to complete the main task.",
      },
      {
        type: "callout",
        html: "A website launch is successful when the right customer can find the business, understand the offer, trust the information, and take the next step without friction.",
      },
      {
        type: "p",
        html: "If your current site needs a second look, <a href='/contact/' class='text-accent hover:underline font-semibold'>contact Gulf Coast Digital Designs for a straightforward review</a>. We build and improve websites for small businesses from Bay St. Louis to Pascagoula.",
      },
    ],
  },

  {
    slug: "gulf-coast-digital-marketing-seo-geo-guide",
    title: "How Gulf Coast Businesses Get Found on Google and AI Search",
    excerpt:
      "A practical guide to digital marketing, website design, SEO, answer engine optimization, and generative engine optimization for Mississippi Gulf Coast small businesses.",
    date: d("gulf-coast-digital-marketing-seo-geo-guide"),
    readTime: "9 min read",
    category: "Digital Marketing",
    metaTitle:
      "Digital Marketing, SEO & GEO for Gulf Coast Businesses | GulfCDD",
    metaDescription:
      "Learn how Gulf Coast small businesses can combine website design, SEO, AEO, and GEO to become easier to find on Google and AI search.",
    blocks: [
      {
        type: "p",
        html: "Mississippi Gulf Coast businesses get found on Google and AI search by combining a useful, technically sound website with accurate local business information, helpful content, and a reputation earned from real customers. SEO helps search engines discover and rank that work; AEO and GEO make the answers clearer, more quotable, and easier for AI systems to cite.",
      },
      {
        type: "callout",
        html: "<strong>Short answer:</strong> Start with a fast, accessible website that clearly explains what you do, where you work, and how customers can contact you. Then support it with a complete Google Business Profile, helpful service content, real customer proof, and a consistent process for measuring and improving what brings people to you.",
      },
      { type: "h2", text: "What do digital marketing, SEO, AEO, and GEO each do?" },
      {
        type: "p",
        html: "These terms overlap, but they are not interchangeable. <strong>Digital marketing</strong> is the broad category: the website, search visibility, email, social channels, reviews, advertising, and other online ways you attract and serve customers. <strong>SEO</strong>—search engine optimization—helps search engines understand your pages and helps people find them through unpaid search results.",
      },
      {
        type: "p",
        html: "<strong>AEO</strong> means answer engine optimization. It is the practice of organizing useful information so a search engine, voice assistant, or AI answer tool can identify a direct response to a question. <strong>GEO</strong>—generative engine optimization—usually refers to making content easy for generative search systems to retrieve, understand, and cite. The labels are newer than the work. Clear information, strong technical foundations, and trustworthy experience still do most of the heavy lifting.",
      },
      {
        type: "ul",
        items: [
          "Digital marketing brings the channels together around a business goal, such as qualified calls or estimate requests.",
          "Website design makes the information easy to use, trust, and act on across phones, tablets, and desktops.",
          "SEO improves discoverability and helps search engines connect a page to the right intent.",
          "AEO makes specific questions and answers obvious to both people and machines.",
          "GEO extends that answer-first approach to AI search and other generative experiences.",
        ],
      },
      { type: "h2", text: "Does website design affect search visibility?" },
      {
        type: "p",
        html: "Yes. Design is not only color, layout, and photography. A search-ready design gives each important page a clear purpose, uses readable headings, works well on a phone, loads efficiently, and makes the next step obvious. If a visitor cannot tell whether you serve their city or how to request help, a beautiful homepage is not doing enough business work.",
      },
      {
        type: "p",
        html: "A useful site architecture also gives search engines a path through your content. A home page can introduce the business, a <a href='/services/design/' class='text-accent hover:underline font-semibold'>custom website design page</a> can explain the build approach, and focused service pages can answer the questions people ask before they call. A <a href='/services/development/' class='text-accent hover:underline font-semibold'>custom applications and development page</a> can then describe forms, stores, portals, or other functionality without forcing every service into one vague page.",
      },
      {
        type: "p",
        html: "The <a href='/blog/mississippi-gulf-coast-website-launch-checklist/' class='text-accent hover:underline font-semibold'>Mississippi Gulf Coast website launch checklist</a> is a helpful companion here. It covers the practical details that are easy to miss when a project is judged only by its visual design: forms, accessibility, speed, security, structured content, and the handoff after launch.",
      },
      { type: "h2", text: "How does local SEO help a Gulf Coast business get found?" },
      {
        type: "p",
        html: "Local SEO connects a business to a place and a customer need. For a business serving the Coast, that may mean explaining service areas from <a href='/service-areas/bay-st-louis/' class='text-accent hover:underline font-semibold'>Bay St. Louis</a> through <a href='/service-areas/pascagoula/' class='text-accent hover:underline font-semibold'>Pascagoula</a>, not simply repeating “Mississippi Gulf Coast” on every page. Each location mention should be accurate and useful: what you offer there, who you serve, what the process looks like, or what makes the local situation different.",
      },
      {
        type: "p",
        html: "Google's <a href='https://support.google.com/business/answer/7091' target='_blank' rel='noopener noreferrer' class='text-accent hover:underline font-semibold'>official local-ranking guidance</a> says local results are mainly based on relevance, distance, and prominence. That makes the basics worth doing well: complete business information, an accurate Google Business Profile, consistent contact details, a crawlable website, real reviews, and references from relevant websites. None of those is a shortcut to a guaranteed position, but together they help a customer and a search engine understand whether your business is a good match.",
      },
      {
        type: "p",
        html: "For more detail, see our <a href='/blog/google-business-profile-mississippi/' class='text-accent hover:underline font-semibold'>Google Business Profile guide for Mississippi small businesses</a>. It covers categories, service areas, photos, reviews, and updates without treating the profile as a replacement for your own website.",
      },
      { type: "h2", text: "What does Google say about SEO for AI search?" },
      {
        type: "p",
        html: "Google's <a href='https://developers.google.com/search/docs/appearance/ai-features' target='_blank' rel='noopener noreferrer' class='text-accent hover:underline font-semibold'>guidance on AI features in Search</a> says the same foundational SEO best practices remain relevant and that there are no additional requirements or special optimizations needed to appear in AI Overviews or AI Mode. It specifically points site owners toward helpful content, crawlable internal links, important information in text, high-quality images, and structured data that matches what people can see on the page.",
      },
      {
        type: "p",
        html: "That is useful perspective for a small business owner. You do not need to publish a page called “What AI thinks about my company,” add robotic wording, or repeat “GEO” in every heading. You need to answer real customer questions better than a thin, generic page does. If someone asks whether you work in Gulfport, what a website project includes, or how quickly a quote starts, answer that question in plain language and keep the answer current.",
      },
      {
        type: "p",
        html: "Google's <a href='https://developers.google.com/search/docs/fundamentals/creating-helpful-content' target='_blank' rel='noopener noreferrer' class='text-accent hover:underline font-semibold'>people-first content guidance</a> is the right standard: create information for people, not pages written mainly to manipulate rankings. A local point of view, first-hand process knowledge, clear limitations, and examples from the market you actually serve are more valuable than a paragraph stuffed with every variation of “website design SEO Gulf Coast.”",
      },
      { type: "h2", text: "What kind of content can earn organic links and citations?" },
      {
        type: "p",
        html: "The most linkable local content is something another person can use or confidently reference. A generic “we are the best” page gives a writer little reason to cite it. A clear checklist, original process explanation, local resource, comparison, or well-supported answer can become a useful reference for a chamber, trade group, community organization, partner, or another business owner.",
      },
      {
        type: "ul",
        items: [
          "Publish a transparent website launch checklist that business owners can share with a designer.",
          "Explain a local process, such as what information a contractor should collect before an estimate.",
          "Create a comparison that names tradeoffs instead of declaring one solution best for everyone.",
          "Answer the questions customers ask on the phone, including who you serve, what is included, and what happens next.",
          "Cite the primary source when a claim comes from Google, a government agency, or another expert organization.",
          "Update useful guides when the platform, service, or local business information changes.",
        ],
      },
      {
        type: "p",
        html: "Links should be earned, not engineered. A Gulf Coast business can make a legitimate outreach list of organizations it already belongs to, suppliers it works with, local directories that accept accurate listings, and community resources where its guide genuinely helps. Do not buy a bundle of low-quality links or promise that a particular number of links will produce a ranking. Google's <a href='https://developers.google.com/search/docs/fundamentals/seo-starter-guide' target='_blank' rel='noopener noreferrer' class='text-accent hover:underline font-semibold'>SEO Starter Guide</a> is a better foundation: make the site useful, easy to find, and understandable.",
      },
      { type: "h2", text: "What should a small business measure?" },
      {
        type: "p",
        html: "Measure business outcomes alongside visibility. Rankings and impressions can show whether discovery is improving, but they do not tell you whether the right people are taking action. Track the pages that receive organic visits, calls and quote requests attributed to the site, the service or location pages people view, and the questions that still lead to confusion or drop-off.",
      },
      {
        type: "ul",
        items: [
          "Discovery: organic clicks, impressions, branded searches, and visits to important service pages.",
          "Local intent: calls, direction requests, profile interactions, and visits from the cities you actually serve.",
          "Answer quality: which FAQ or guide sections keep people engaged and which questions still generate follow-up calls.",
          "Conversion: completed quote forms, qualified calls, email inquiries, and the source or landing page connected to each lead.",
          "Trust and maintenance: review activity, accurate business details, broken links, page speed, and content freshness.",
        ],
      },
      {
        type: "p",
        html: "A good <a href='/services/seo/' class='text-accent hover:underline font-semibold'>local SEO plan</a> turns those measurements into a sequence of improvements. Start with the page or customer question closest to revenue, fix the information gap, make the page easier to use, and then review the result instead of changing everything at once.",
      },
      { type: "h2", text: "What is a practical Gulf Coast SEO, AEO, and GEO checklist?" },
      {
        type: "ul",
        items: [
          "Write one plain-language sentence explaining what you do, who you serve, and where you work.",
          "Give every important service its own useful page when customers search for it separately.",
          "Use accurate city and service-area information instead of duplicated location pages with swapped names.",
          "Claim and complete your Google Business Profile, then keep hours, services, photos, and contact details current.",
          "Answer common questions in the first sentence, then add context, examples, limitations, and next steps.",
          "Link related pages with descriptive anchor text so visitors and crawlers can follow the topic naturally.",
          "Add structured data only when it accurately describes visible content and the page type.",
          "Test the experience on a phone: speed, contrast, keyboard access, tap targets, forms, and contact options.",
          "Review analytics and search data regularly, then update pages when the business or customer questions change.",
        ],
      },
      { type: "h2", text: "Key takeaways for Gulf Coast business owners" },
      {
        type: "ul",
        items: [
          "SEO, AEO, and GEO are not separate substitutes for a good website; they are ways of making useful business information easier to discover and understand.",
          "Google's own AI-search guidance points back to foundational SEO, helpful content, internal links, text, images, and accurate structured data.",
          "Local visibility depends on relevance, distance, and prominence, so accurate service-area information and a complete business profile matter.",
          "The best backlink opportunity is a genuinely useful resource that another organization or writer would be comfortable sharing.",
          "The strongest measurement is not a ranking screenshot alone; it is whether the right customers can find you, understand you, and contact you.",
        ],
      },
      { type: "h2", text: "Frequently asked questions about SEO, AEO, and GEO" },
      {
        type: "faq",
        question: "Is GEO different from SEO?",
        answerHtml: "GEO is a newer term for preparing content for generative search and AI answer experiences. It does not replace SEO. A business still needs crawlable pages, helpful information, strong technical foundations, and a trustworthy presence before an AI system has a reliable source to retrieve or cite.",
      },
      {
        type: "faq",
        question: "Do I need an AI-generated website to appear in AI search?",
        answerHtml: "No. Google says there are no special AI-only requirements for appearing in AI Overviews or AI Mode. A fast, accessible site with original, useful, text-based answers and sound SEO fundamentals is a better starting point than adding AI wording for its own sake.",
      },
      {
        type: "faq",
        question: "How long does SEO take for a Gulf Coast small business?",
        answerHtml: "SEO does not have a reliable one-size-fits-all timeline. The starting condition of the website, local competition, business history, content quality, technical issues, and consistency all matter. Begin with the highest-value foundations, measure qualified inquiries, and expect improvement to come from repeated useful work rather than a single launch.",
      },
      {
        type: "faq",
        question: "Should every Gulf Coast city have its own location page?",
        answerHtml: "Only when the page adds genuinely useful information for customers in that place. A location page can explain service availability, local context, examples, or the process for that market. Copying the same text and changing the city name creates thin content and makes the site harder to trust.",
      },
      {
        type: "faq",
        question: "What is the first SEO improvement a small business should make?",
        answerHtml: "Start by making the core offer and service area unmistakable on the website and Google Business Profile. Then fix the most important customer path: a service page, phone number, quote form, hours, or contact instructions that currently create confusion or friction.",
      },
      {
        type: "faq",
        question: "Can content guarantee a backlink or AI citation?",
        answerHtml: "No. Useful content can create a reason for people to reference a business, but no ethical strategy can guarantee a backlink, ranking, AI citation, or inclusion in a particular answer. The durable approach is to publish accurate resources, build real relationships, and keep the information current.",
      },
      {
        type: "p",
        html: "If your website is hard to find, hard to use, or difficult to keep current, <a href='/contact/' class='text-accent hover:underline font-semibold'>get a free quote from Gulf Coast Digital Designs</a>. We build custom websites and practical search foundations for small businesses across the Gulf Coast, from Bay St. Louis to Pascagoula.",
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getRecentPosts(exclude?: string, count = 3): BlogPost[] {
  return posts
    .filter((p) => p.slug !== exclude)
    .slice(0, count);
}
