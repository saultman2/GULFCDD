export interface Tier {
  key: string;
  name: string;
  badge: string | null;
  tagline: string;
  description: string;
  features: string[];
  highlight: boolean;
  cta: string;
  startingPrice?: string;
  foundingPrice?: string;
  isCustom?: boolean;
}

/**
 * Approved public plans only. Do not add page counts, hours, or other
 * inclusions that have not been confirmed.
 */
export const tiers: Tier[] = [
  {
    key: "essential",
    name: "Essential",
    badge: null,
    tagline: "Hosting and upkeep.",
    description:
      "Essential is $150 a month for hosting and upkeep. Every plan includes a monthly analytics report. Month to month, no contract.",
    features: [
      "Hosting and upkeep",
      "Monthly analytics report",
      "Month to month, no contract",
    ],
    highlight: false,
    cta: "Get a Free Quote",
    startingPrice: "$150/mo",
  },
  {
    key: "growth",
    name: "Growth",
    badge: "Most popular",
    tagline: "Adds local SEO and blog posts.",
    description:
      "Growth is $500 a month, or $250 a month for founding clients. It adds local SEO and blog posts. Every plan includes a monthly analytics report. Month to month, no contract.",
    features: [
      "Hosting and upkeep",
      "Local SEO",
      "Blog posts",
      "Monthly analytics report",
      "Month to month, no contract",
    ],
    highlight: true,
    cta: "Get a Free Quote",
    startingPrice: "$500/mo",
    foundingPrice: "$250/mo founding",
  },
  {
    key: "full-service",
    name: "Full Service",
    badge: null,
    tagline: "Monthly plan for the full service relationship.",
    description:
      "Full Service is $1,000 a month, or $500 a month for founding clients. Every plan includes a monthly analytics report. Month to month, no contract.",
    features: [
      "Monthly analytics report",
      "Month to month, no contract",
    ],
    highlight: false,
    cta: "Get a Free Quote",
    startingPrice: "$1,000/mo",
    foundingPrice: "$500/mo founding",
  },
];

export const FOUNDING_OFFER =
  "Founding clients get the website build free. The offer ends January 31, 2027.";
