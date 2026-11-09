/**
 * JCTEF site copy: the single source of truth for every page.
 *
 * Migrated from the old WordPress site (jctef.org) in November 2026, with:
 *  - typos fixed ("Get Involve", "Learn More Us", "Project Complate",
 *    "Organizationfor", "corhort", "toJCTEF", "JCETF")
 *  - British / Nigerian English spelling ("programme", "organisation")
 *  - links to the old chidimmafoundation.org domain and "#" removed
 *
 * Anything the JCTEF team still needs to confirm is marked `// TODO:`.
 */

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type Link = { label: string; href: string };
export type TitledText = { title: string; text: string };
export type Social = { label: string; href: string };
export type JctefEvent = {
  slug: string;
  title: string;
  subtitle?: string;
  /** ISO 8601 with the Lagos offset (WAT, +01:00), or null if not set yet. */
  startsAt: string | null;
  /** When it finishes. Events disappear from the site once this (or, if
   * missing, the end of the start day) has passed. */
  endsAt?: string;
  /** Human-readable date line, e.g. "Saturday 12 December 2026". */
  dateLabel: string;
  timeLabel?: string;
  /** General area, used when there is no specific venue yet. */
  location: string;
  /** Specific venue. Gets a "Get directions" link to Google Maps. */
  venue?: string;
  /** false shows a "subject to change" note under the venue. */
  venueConfirmed?: boolean;
  summary: string;
  cta?: Link;
  image?: { src: string; alt: string; width: number; height: number };
};
/**
 * `kind: "quote"` is the fellow's own words (shown in quotation marks).
 * `kind: "summary"` was written about the fellow, so it is shown as
 * "What they gained", never as a quote.
 */
export type Testimonial = {
  kind: "quote" | "summary";
  text: string;
  name: string;
  role: string;
  /** Pronoun for the summary heading, e.g. "What she gained". */
  pronoun?: "she" | "he" | "they";
  photo?: string;
};

/* -------------------------------------------------------------------------- */
/* Site-wide                                                                  */
/* -------------------------------------------------------------------------- */

export const site = {
  name: "Jacob Chidimma Transformation and Empowerment Foundation",
  shortName: "JCTEF",
  tagline: "Transform, Equip, Empower",
  coreMessage: "From potential to productivity",
  description:
    "JCTEF is a youth-focused nonprofit in Lekki, Lagos, helping young people move from potential to productivity through mindset transformation, skills training, mentorship and access to funding.",
  url: "https://jctef.org",
  donateUrl: "https://flutterwave.com/donate/1pci95j4kyk9",
  /** Corporate Affairs Commission (CAC) registration number. */
  registration: { label: "RC", number: "8937457" },
  // Area only, by decision of the JCTEF team: never publish a street address.
  address: "Lekki, Lagos, Nigeria",
  email: "info@jctef.org",
  phone: "+234 815 171 4278",
  phoneHref: "tel:+2348151714278",
  whatsapp: "+234 815 171 4278",
  whatsappMessage:
    "Hello JCTEF, I'd like to find out more about your programmes.",
  hours: "Monday to Friday, 9:00am to 5:00pm WAT",
  enquiries: [
    { label: "General enquiries", email: "info@jctef.org" },
    { label: "Youth applications", email: "program@jctef.org" },
    { label: "Training information", email: "training@jctef.org" },
    // Partnerships use the enquiry form, which sends to PARTNER_TO_EMAIL.
    { label: "Partnerships", email: "partner@jctef.org", href: "/get-involved#partner-form", linkLabel: "Partnership enquiry form" },
    { label: "Donations and support", email: "donate@jctef.org" },
    { label: "Volunteering", email: "info@jctef.org" },
  ],
  socials: [
    { label: "Facebook", href: "https://www.facebook.com/OfficialJCTEF/" },
    { label: "Instagram", href: "https://www.instagram.com/official_jctef/" },
    { label: "X", href: "https://x.com/Official_jctef" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/cdm-foundation",
    },
    { label: "TikTok", href: "https://www.tiktok.com/@jctef" },
    { label: "YouTube", href: "https://www.youtube.com/@jctef" },
  ] satisfies Social[],
} as const;

/** Registration wording: small trust signals, never a headline. */
const rc = `${site.registration.label} ${site.registration.number}`;
export const registration = {
  short: rc,
  trust: `Registered nonprofit · ${rc}`,
  full: `Registered with the Corporate Affairs Commission (CAC), Nigeria. ${rc}.`,
};

/**
 * Link previews (WhatsApp, X, LinkedIn, Facebook, Telegram, Slack) and search
 * results: one title and description per page. Descriptions: 120-160 characters.
 */
export const seo = {
  home: {
    title: `${site.shortName}: ${site.coreMessage}`,
    description:
      "JCTEF is a youth-focused nonprofit in Lekki, Lagos, focused on human capital development through structured programmes that guide young people through mindset transformation, personal development, capacity building, practical skills acquisition, mentorship, and access to funding and other opportunities, equipping them to build economic resilience and live purposeful, productive lives.",
  },
  about: {
    title: "About JCTEF",
    description:
      "Who we are at JCTEF: the young people we serve, our vision, mission and values, the story of our founder Chidimma Jacob Angel, and the team behind it all.",
  },
  programmes: {
    title: "Our programmes",
    description:
      "Transformation Programme, Young Minds, Campus Wellness, Business Summit, Annual Retreat and The Tech Paragon, Women in Tech Community: JCTEF's pathways from potential to productivity.",
  },
  institute: {
    title: "JCTEF Institute",
    description:
      "The JCTEF Institute for Human Capital Development and its nine-stage Human Capital Transformation Framework for building mindset, skills and productivity.",
  },
  getInvolved: {
    title: "Get involved",
    description:
      "Volunteer your time and skills, partner with us or sponsor a programme, and help JCTEF guide young people in Nigeria from potential to productivity.",
  },
  blog: {
    title: "Blog",
    description:
      "News and stories from JCTEF: updates from our Transformation Programme fellows, programmes, events and research on human capital development.",
  },
  contact: {
    title: "Contact us",
    description:
      "Contact JCTEF in Lekki, Lagos: email info@jctef.org, call +234 815 171 4278 or chat with us on WhatsApp. Young people, partners and volunteers welcome.",
  },
} satisfies Record<string, { title: string; description: string }>;

export const navigation = {
  main: [
    { label: "About", href: "/about" },
    { label: "Programmes", href: "/programmes" },
    { label: "JCTEF Institute", href: "/institute" },
    { label: "Get Involved", href: "/get-involved" },
    { label: "Blog", href: "/blog" },
  ] satisfies Link[],
  /** Shown in the mobile drawer and footer, not the desktop bar. */
  secondary: [{ label: "Contact", href: "/contact" }] satisfies Link[],
  donate: { label: "Donate", href: site.donateUrl },
  footer: [
    { label: "About us", href: "/about" },
    { label: "Our founder", href: "/about#founder" },
    { label: "Programmes", href: "/programmes" },
    { label: "JCTEF Institute", href: "/institute" },
    { label: "Get involved", href: "/get-involved" },
    { label: "Partner with us", href: "/get-involved#partner-form" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ] satisfies Link[],
};

/* -------------------------------------------------------------------------- */
/* Shared building blocks                                                     */
/* -------------------------------------------------------------------------- */

/** What JCTEF helps young people do. Shared by the homepage and About page. */
export const outcome =
  "move from potential to productivity and from unemployment to opportunity, so they can thrive purposefully";

/** The four pillars of JCTEF's work. */
export const pillars: (TitledText & { short: string })[] = [
  {
    short: "Mindset",
    title: "Personal development and mindset transformation",
    text: "We help young people build the confidence, resilience and growth mindset to seize opportunities and overcome challenges.",
  },
  {
    short: "Skills",
    title: "Hands-on skills training",
    text: "Industry-relevant digital, vocational and technical skills that open doors to employment and enterprise.",
  },
  {
    short: "Education",
    title: "Education funding",
    text: "We fund formal and informal education for the less privileged, so access to learning is not decided by circumstance.",
  },
  {
    short: "Business",
    title: "Business support and start-up funding",
    text: "Start-up support, resources and access to funding for trainees ready to build sustainable livelihoods.",
  },
];

/**
 * The six programme stages: the journey from potential to productivity.
 * Currently unused: the journey section was removed from the homepage and the
 * Programmes page at the JCTEF team's request. Kept for future use.
 */
export const programmeStages: (TitledText & { short: string })[] = [
  {
    short: "Mindset",
    title: "Personal development and mindset transformation",
    text: "Develop a growth mindset, build confidence, strengthen resilience and unlock full potential.",
  },
  {
    short: "JHCI",
    title: "JCTEF Human Capital Index (JHCI)",
    text: "Measure each fellow's transformation, tracking growth in mindset, skills, leadership, employability and economic readiness.",
  },
  {
    short: "Skills",
    title: "Training and skills acquisition",
    text: "Practical digital, industrial and vocational skills that unlock employment, entrepreneurship and economic independence.",
  },
  {
    short: "Mentorship",
    title: "Mentorship and internship",
    text: "Experienced mentors and industry partners offer practical experience, career guidance and workplace readiness.",
  },
  {
    short: "Funding",
    title: "Empowerment and funding",
    text: "Start-up support, financial assistance and essential resources to launch sustainable businesses and livelihoods.",
  },
  {
    short: "Growth",
    title: "Monitoring and growth support",
    text: "Continuous guidance, progress tracking and development opportunities for long-term personal and professional growth.",
  },
];

/** Who JCTEF serves (homepage cards and About page list). */
export const audiences: (TitledText & { sentence?: string })[] = [
  {
    title: "Young people aged 7 to 45",
    text: "At different life stages, equipping them to live and thrive purposefully.",
    /** Used as one sentence where the list reads as prose (About page). */
    sentence:
      "Young people aged 7 to 45 at different life stages, equipping them to live and thrive purposefully.",
  },
  {
    title: "Underprivileged or unemployed people",
    text: "People who have the will to work and grow but lack the skills, network or capital to start.",
  },
  {
    title: "Ex-offenders and people in recovery",
    text: "Ex-offenders and rehabilitated addicts rebuilding their lives with dignity and a second chance.",
  },
  {
    title: "Orphans and school dropouts",
    text: "Young people whose education or support system was cut short, given a structured path forward.",
  },
];

export const vision =
  "To become a globally recognised organisation for human transformation, advancing human capital development through strategic programmes and practical empowerment, while raising a generation of purpose-driven, productive and economically independent individuals who transform communities and nations.";

export const mission =
  "To help individuals discover their potential, develop their human capital, strengthen their minds, acquire marketable skills and become productive contributors who create lasting value for themselves, their communities and society.";

// TODO: confirm with JCTEF team (core values descriptions)
export const coreValues: TitledText[] = [
  {
    title: "Transformation",
    text: "Lasting change begins on the inside, so we start with mindset.",
  },
  {
    title: "Empathy",
    text: "We meet people where they are, without labels or judgement.",
  },
  {
    title: "Integrity",
    text: "We do what we say, and we are honest about what we have done.",
  },
  {
    title: "Accountability",
    text: "We report progress to fellows, partners and donors alike.",
  },
  {
    title: "Excellence",
    text: "We hold our programmes, and ourselves, to a high standard.",
  },
  {
    title: "Innovation",
    text: "We test new ideas and keep what works for young people.",
  },
];
// TODO: the one-line value descriptions above are new (the old site only
// listed the six value names). Please review the wording.

/** The four kinds of partner JCTEF works with. */
export const partnerTypes: TitledText[] = [
  {
    title: "Government ministries",
    text: "Working with youth, education and labour ministries on policy alignment and programme support.",
  },
  {
    title: "Private companies",
    text: "CSR partnerships that provide jobs, internships, mentorship and funding for young people.",
  },
  {
    title: "NGOs and faith groups",
    text: "Working with NGOs, faith-based organisations and schools to reach more underprivileged youth.",
  },
  {
    title: "International organisations and donors",
    text: "Local and international donors supporting the mission through funding and resources.",
  },
];

// TODO: confirm each fellow approved this wording for publication
export const testimonials: Testimonial[] = [
  {
    kind: "summary",
    pronoun: "she",
    name: "Ojo Boluwatife Moyosore",
    role: "JCTEF Fellow, Cohort 1",
    text: "Gained insight into capacity building, valuable skills, and how to sell her value and skills.",
  },
  {
    kind: "quote",
    name: "Jinadu Teslim O.",
    role: "JCTEF Fellow, Cohort 1",
    text: "I gained guidance on self-discovery and identifying my path, and insight into how to translate my value into earning. I'm grateful to JCTEF for helping me gain clarity.",
  },
  {
    kind: "quote",
    name: "Joshua Oluwadare Ajao",
    role: "JCTEF Fellow, Cohort 1",
    text: "JCTEF helped me with character development, especially emotional intelligence. People around me have been commenting on the positive change, and I'm grateful to JCTEF for the work they do.",
  },
];

/* -------------------------------------------------------------------------- */
/* Homepage                                                                   */
/* -------------------------------------------------------------------------- */

export const home = {
  hero: {
    eyebrow: "Transform, Equip, Empower",
    title: "From potential to productivity",
    text: "Focused on human capital development through structured programmes that guide young people through mindset transformation, personal development, capacity building, practical skills acquisition, mentorship, and access to funding and other opportunities, equipping them to build economic resilience and live purposeful, productive lives.",
    primaryCta: { label: "Explore our programmes", href: "/programmes" },
    secondaryCta: { label: "Support JCTEF", href: site.donateUrl },
    // TODO: replace with a real, consented photo of JCTEF fellows
    // (at least 1600px wide, landscape). Placeholder for now.
    image: {
      src: "/images/hero-placeholder.svg",
      alt: "Placeholder illustration in JCTEF green and navy, standing in for a photo of JCTEF fellows",
      width: 1200,
      height: 1000,
    },
  },
  about: {
    eyebrow: "About JCTEF",
    title: "Lasting empowerment begins with transformation",
    text: [
      "JCTEF is a youth-focused nonprofit organisation committed to transforming lives by equipping young people with the mindset, skills, opportunities and support they need to thrive.",
      `Before people can change their circumstances, they must first change the way they think, grow in their capabilities and discover their purpose. So we help young people ${outcome}.`,
    ],
    cta: { label: "Learn more about us", href: "/about" },
  },
  audiences: {
    eyebrow: "Who we serve",
    title: "Built for the young people others overlook",
  },
  // TODO: confirm figures with JCTEF team
  impact: {
    /** Visually hidden heading; the section shows figures only. */
    title: "Our impact",
    stats: [
      { value: "300+", label: "young people empowered" },
      // TODO: confirm partner count
      { value: "2", label: "partner organisations" },
      { value: "6", label: "projects completed" },
      { value: "1+", label: "year of service" },
    ],
  },
  testimonials: {
    eyebrow: "In their words",
    title: "Fellows from Cohort 1",
  },
  values: {
    eyebrow: "Our direction",
    title: "Vision, mission and core values",
  },
  events: {
    eyebrow: "Upcoming events",
    title: "Come and meet us",
    countdownLabel: "Time until RESET 2027",
    venueNote:
      "Venue subject to change. Final details will be shared with registered attendees.",
    directionsLabel: "Get directions",
  },
  partners: {
    eyebrow: "Partnerships",
    title: "We cannot do this alone",
    text: "Lasting transformation is built together. We partner with organisations that share our belief in young people.",
    cta: { label: "Partner with us", href: "/get-involved#partner-form" },
  },
  getInvolved: {
    eyebrow: "Get involved",
    title: "Be part of the change",
    cards: [
      {
        title: "Volunteer",
        text: "Give your time and skills as a mentor, trainer, counsellor or creative.",
        cta: { label: "Become a volunteer", href: "/get-involved#volunteer" },
      },
      {
        title: "Partner",
        text: "Sponsor a cohort, host interns or co-design programmes with us.",
        cta: { label: "Partner with us", href: "/get-involved#partner-form" },
      },
      {
        title: "Donate",
        text: "Fund training, education and start-up support for the next fellow.",
        cta: { label: "Donate now", href: site.donateUrl },
      },
    ],
  },
  newsletter: {
    title: "Stay up to date",
    text: "News about our fellows, events, research and new programmes, a few times a year.",
    consent:
      "I agree to receive updates, publications and newsletters from JCTEF.",
  },
};

/* -------------------------------------------------------------------------- */
/* Homepage hero slideshow                                                    */
/* -------------------------------------------------------------------------- */

export type HeroSlide = {
  /** Cloudinary public ID (cloud: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME). Never a raw
   * file URL: Cloudinary converts every photo, including iPhone HEIC files, to
   * AVIF/WebP/JPEG for each browser. */
  publicId: string;
  /** Who is in the photo and what is happening. */
  alt: string;
  /** CSS object-position for any extra cropping after Cloudinary's face crop. */
  focus: string;
};

// TODO: confirm everyone in these photos agreed to appear on the website.
// IMG_0238 was uploaded twice (IMG_0238_xsd9lt and IMG_0238_t45fdj are the
// same photo), so only one copy is used.
// If this list is empty, the hero falls back to the illustration layout.
export const heroSlides: HeroSlide[] = [
  {
    publicId: "IMG_7078_tocqtx",
    alt: "A group of JCTEF Cohort 1 fellows standing outdoors on a lawn, holding a banner for the JCTEF Transformation Programme end-of-programme meetup",
    focus: "center 35%",
  },
  {
    publicId: "IMG_0238_xsd9lt",
    alt: "Two JCTEF fellows standing outdoors, holding a banner for the Cohort 1 end-of-programme meetup",
    focus: "center 30%",
  },
];

/* -------------------------------------------------------------------------- */
/* Homepage: Outreach in action gallery                                       */
/* -------------------------------------------------------------------------- */

export type OutreachPhoto = {
  /** Cloudinary public ID (cloud: dreezy), never a raw file URL. */
  publicId: string;
  /** What is happening in the photo, factually. */
  alt: string;
  /** What, where and when, e.g. "Mindset session, Ikeja, September 2026".
   * Leave empty until known; the caption strip is then hidden. */
  caption: string;
  /** CSS object-position for the lightbox, if faces need nudging. */
  focus?: string;
};

export const outreach = {
  eyebrow: "Outreach",
  title: "Outreach in action",
  text: "Moments from our work with young people and communities across Nigeria.",
};

// TODO: confirm consent for every photo, including from parents or the
// school for photos of children.
// The section stays hidden while this list is empty.
export const outreachPhotos: OutreachPhoto[] = [
  {
    publicId: "IMG-20251024-WA0120_tiei8e",
    alt: "A facilitator in a black T-shirt stands with a group of secondary school students in blue patterned uniforms in a classroom during a web development training session, with laptops open on the tables in front of them",
    caption:
      "Web development training for SS3 students at Champions Headstart International School, Lagos, October 2025", // TODO: confirm the date
  },
  {
    publicId: "20251111_125140_1_euzahs",
    alt: "A facilitator in a blue T-shirt stands with a large group of secondary school students in light blue shirts and navy uniforms in a computer room during an AI and tech careers session, with desktop computers on the desks and a projection screen behind them",
    caption:
      "AI and tech careers session for SS3 students at Oduduwa College, Osun State, November 2025", // TODO: confirm the date
  },
  {
    publicId: "20251110_114900_1_nvd24j",
    alt: "A facilitator in a red shirt presents from a laptop to teachers seated at desks with computer monitors during an AI training session, with a slide projected on the screen at the front",
    caption:
      "AI training for teachers at Oduduwa College, a government school in Osun State, November 2025", // TODO: confirm the date
  },
  {
    publicId: "20251111_132814_1_zgsj6y",
    alt: "Seen from the back of a classroom, a large class of secondary school students in light blue uniforms raise their hands as a facilitator in a white T-shirt leads an AI and tech careers session at the whiteboard",
    caption:
      "AI and tech careers session for SS3 students at St Davids College, Osun State, November 2025", // TODO: confirm the date
  },
  // These two are also in the hero slideshow (kept here at the team's request).
  {
    publicId: "IMG_7078_tocqtx",
    alt: "A group of JCTEF Cohort 1 fellows standing outdoors on a lawn, holding a banner for the JCTEF Transformation Programme end-of-programme meetup",
    caption: "Cohort 1 end-of-programme meetup, Lagos chapter, Ikeja, November 2026", // TODO: confirm the date (from the event banner)
  },
  {
    publicId: "IMG_0238_xsd9lt",
    alt: "Two JCTEF fellows standing outdoors, holding a banner for the Cohort 1 end-of-programme meetup",
    caption: "Cohort 1 end-of-programme meetup, Lagos chapter, Ikeja, November 2026", // TODO: confirm the date (from the event banner)
  },
];

/* -------------------------------------------------------------------------- */
/* Homepage FAQs                                                              */
/* -------------------------------------------------------------------------- */

export type Faq = { question: string; answer: string; link?: Link };

// TODO: JCTEF team to review and approve FAQ answers
export const faqs: Faq[] = [
  {
    question: "What is JCTEF?",
    answer:
      "The Jacob Chidimma Transformation and Empowerment Foundation (JCTEF) is a youth-focused nonprofit in Lekki, Lagos. We help young people move from potential to productivity through mindset transformation, skills training, mentorship and access to funding.",
    link: { label: "More about JCTEF", href: "/about" },
  },
  {
    question: "Who can join JCTEF programmes?",
    answer:
      "Our programmes are for young people aged 7 to 45, including underprivileged or unemployed people, ex-offenders and people in recovery, orphans and school dropouts. They are open to both educated and non-educated people who are committed to personal growth.",
    link: {
      label: "See the eligibility criteria",
      href: "/programmes#eligibility",
    },
  },
  {
    question: "How much does it cost to join a programme?",
    // Confirmed by the JCTEF team: free.
    answer:
      "Our programmes are free to join, thanks to our partners, sponsors and donors.",
  },
  {
    question: "How do I apply for the next cohort?",
    answer:
      "Email program@jctef.org or call us to apply. Every applicant goes through screening, including background checks and an interview, before joining a cohort.",
    link: { label: "How to become a fellow", href: "/institute#fellow" },
  },
  {
    question: "How long does the programme last?",
    // Confirmed by the JCTEF team: three months.
    answer: "The JCTEF Transformation Programme lasts three months.",
    link: {
      label: "About the Transformation Programme",
      href: "/programmes#transformation",
    },
  },
  {
    question: "How can I volunteer or become a mentor?",
    answer:
      "Fill in our volunteer form. We welcome mentors, trainers, counsellors and mental health professionals, as well as people with admin, creative and outreach skills.",
    link: { label: "Ways to volunteer", href: "/get-involved#volunteer" },
  },
  {
    question: "How can my organisation partner with JCTEF?",
    answer:
      "Send us a partnership enquiry through the form on our Get Involved page. Partners can sponsor fellows' training, offer internships and mentorship, or fund skills and start-up support.",
    link: { label: "Partner with us", href: "/get-involved#partner-form" },
  },
  {
    question: "How can I donate, and how is my donation used?",
    answer:
      "You can donate online through our Flutterwave page. Donations fund training, technical and vocational skills, mentorship, education support and start-up grants for young people.",
    link: { label: "Donate now", href: site.donateUrl },
  },
];

/* -------------------------------------------------------------------------- */
/* Events                                                                     */
/* -------------------------------------------------------------------------- */

export const events: JctefEvent[] = [
  {
    slug: "reset-2027",
    title: "RESET 2027: JCTEF Annual Retreat",
    subtitle: "Reflect. Recalibrate. Rebuild.",
    startsAt: "2026-12-12T11:00:00+01:00",
    endsAt: "2026-12-12T17:00:00+01:00",
    dateLabel: "Saturday 12 December 2026",
    timeLabel: "11:00am to 5:00pm WAT",
    location: "Lekki, Lagos",
    venue: "Lekki Conservation Centre, Lekki, Lagos",
    // Set to true once the venue is final: the "subject to change" note disappears.
    venueConfirmed: false,
    summary:
      "A one-day retreat to step away from the pressure of the year, reflect honestly and plan intentionally for the year ahead.",
    cta: { label: "Register for RESET 2027", href: "https://bit.ly/Reset2027" },
    image: {
      src: "/images/reset-2027.png",
      alt: "RESET 2027 poster: JCTEF Annual Retreat, 12 December 2026, 11am to 5pm WAT, Lagos. Reflect, recalibrate, rebuild.",
      width: 1122,
      height: 1402,
    },
  },
  {
    slug: "transformation-programme-next-cohort",
    title: "JCTEF Transformation Programme: next cohort",
    startsAt: null,
    // TODO: add the start date of the next cohort (programmes run quarterly).
    dateLabel: "Dates to be announced",
    location: "Lagos",
    summary:
      // TODO: confirm with JCTEF team ("quarterly cohort")
      "Our flagship three-month human capital development programme. Applications open before each quarterly cohort.",
    cta: { label: "Ask about the next cohort", href: "/contact" },
  },
  {
    slug: "business-summit",
    title: "JCTEF Business Summit",
    startsAt: null,
    // TODO: add the date and venue of the next Business Summit.
    dateLabel: "Date to be announced",
    location: "Lagos",
    summary:
      "An annual gathering on talent, entrepreneurship, start-ups, funding and innovation, connecting people and possibilities.",
    cta: { label: "Get updates", href: "/#newsletter" },
  },
];

/* -------------------------------------------------------------------------- */
/* About + founder                                                            */
/* -------------------------------------------------------------------------- */

export const about = {
  intro: {
    eyebrow: "About JCTEF",
    title: "Transforming lives through human capital development",
    text: [
      "The Jacob Chidimma Transformation and Empowerment Foundation (JCTEF) is a youth-focused nonprofit organisation committed to transforming lives by equipping young people with the mindset, skills, opportunities and support they need to thrive.",
      `Through human capital development, skills acquisition, mentorship, workforce development, entrepreneurship support, financial literacy, capacity building and access to funding, we help young people ${outcome}.`,
      "Our mission goes beyond providing resources. We cultivate character, build competence, inspire leadership and empower individuals to become catalysts for positive change in their families, communities and society.",
    ],
    ripple: [
      "When people transform, families transform.",
      "When families transform, communities transform.",
      "And when communities transform, nations prosper.",
    ],
  },
  why: {
    eyebrow: "Why JCTEF exists",
    title:
      "Built on a passion to see people become the best version of themselves",
    text: [
      "Over the years, I have watched people lose their confidence, their joy and sometimes their sense of purpose. Not because they lacked value, but because they never had the opportunity, guidance or environment to discover what they were capable of becoming.",
      "Human potential is one of the world's greatest resources, yet one of its most underdeveloped. That conviction became the foundation of JCTEF.",
      "Our mission is not simply to empower people. It is to walk alongside them, providing guidance, practical tools, mentorship and opportunities that turn potential into productivity, purpose and lasting impact.",
    ],
    affirmations: [
      "We believe in you.",
      "We see your potential.",
      "You matter.",
      "See you at the top!",
    ],
  },
  faq: [
    {
      q: "How can I join a JCTEF programme?",
      a: [
        // TODO: confirm with JCTEF team ("quarterly Transformation Cohorts")
        "JCTEF runs quarterly Transformation Cohorts: our flagship three-month human capital development programme. It is open to both educated and non-educated people who are committed to personal growth.",
        "Every applicant goes through screening and assessment. Selected fellows complete baseline and periodic evaluations using the JCTEF Human Capital Index (JHCI). Outstanding fellows may receive extra support, including skills training, mentorship, start-up support and access to funding, depending on eligibility and availability.",
      ],
    },
    {
      q: "Are JCTEF programmes free?",
      a: [
        "Yes. Our programmes are free to join, thanks to our partners, sponsors and donors. Some specialised programmes have their own eligibility or registration requirements.",
      ],
    },
    {
      q: "Why donate to JCTEF?",
      a: [
        "Your donation is an investment in human potential. It pays for life-changing training, technical and vocational skills, mentorship, entrepreneurship and financial literacy programmes, and connects fellows with start-up and funding opportunities.",
      ],
    },
    {
      q: "Does JCTEF fund businesses?",
      a: [
        "Where possible, we connect eligible fellows to funding, grants and entrepreneurship support. What is available depends on the programme and our partnerships at the time.",
      ],
    },
    {
      q: "Where does JCTEF operate?",
      a: [
        "We are based in Lekki, Lagos, and have run outreach in Lagos and Osun State. As the foundation grows, we aim to reach more regions across Nigeria.",
      ],
    },
    {
      q: "How can I volunteer, partner or support JCTEF?",
      a: [
        "You can donate, volunteer, partner with us, sponsor a programme, mentor fellows or simply share our work with your network. Visit the Get Involved page to start.",
      ],
    },
    {
      q: "What makes JCTEF different?",
      a: [
        "We believe empowerment without transformation produces temporary results. So we develop people first, through mindset, mentorship and practical skills, and then connect them to opportunities that last.",
      ],
    },
  ],
};

export const founder = {
  name: "Chidimma Jacob Angel",
  role: "Founder and Executive Director",
  quote: "Transformation must precede empowerment.",
  photo: {
    src: "/images/founder-chidimma-jacob-angel.jpg",
    alt: "Chidimma Jacob Angel, founder of JCTEF, smiling, wearing a cream blazer over a dark dress",
    width: 768,
    height: 1024,
  },
  // TODO: send a higher-resolution portrait if available (the current one is 768 × 1024).
  story: [
    {
      title: "Every journey begins somewhere",
      text: [
        "I was born in Enugu State, Nigeria, into circumstances where life was often difficult and opportunities were limited. I grew up around limiting beliefs, where dreams seemed unattainable and many people accepted their circumstances as their destiny.",
        "As a young girl, I also saw expectations that limited what women were encouraged to aspire to. But I came to realise that the greatest barriers were the beliefs that convinced people they could never become more than their present circumstances. By the grace of God, I refused to accept those limits.",
      ],
    },
    {
      title: "Building a future one step at a time",
      text: [
        "I studied Education at the University of Nigeria, Nsukka, then moved to Lagos in search of a better future. I baked, cooked, styled hair, worked in cleaning services, ran small businesses and invested in a delivery business. Each one built resilience and discipline.",
        "There were seasons of financial hardship, loneliness and anxiety, when giving up seemed easier than pressing on. I kept moving forward.",
      ],
    },
    {
      title: "Choosing growth over circumstances",
      text: [
        "I learned that true transformation begins from within. Through faith, continuous learning and self-reflection, I broke free from limiting beliefs. As my mindset changed, new opportunities followed: I built a career in banking, then switched careers into software engineering and earned a Master of Information Technology (Software Engineering) from Miva Open University. And the growth continues.",
        "One question stayed with me: what about the millions of young people whose potential remains untapped because they lack guidance, opportunity and belief in themselves? That question became JCTEF.",
      ],
    },
  ],
  philosophy: ["Transformation", "Empowerment", "Productivity"],
  beliefs: [
    "Every individual has untapped potential.",
    "Transformation must precede empowerment.",
    "Human capital is a nation's greatest asset.",
    "Education should produce competence, character and productivity.",
    "Growth is a lifelong journey.",
    "Sustainable development begins by investing in people.",
  ],
  message: [
    "My story is proof that difficult beginnings do not define final outcomes. Every person can grow, overcome adversity and create a meaningful future.",
    "Your story is still being written. Never stop believing in what is possible.",
  ],
};

export type TeamMember = {
  name: string;
  role: string;
  location: string;
  /** Any Cloudinary URL; the card crops it to a face-centred square. */
  image?: string;
  /** For later. Leave out until the team sends them. */
  bio?: string;
  linkedin?: string;
};

/** "Meet our team" on /about. The founder has her own section, so she is not listed here. */
export const team: TeamMember[] = [
  { name: "Tamunoemi Ibrahim", role: "Programme Director", location: "Lagos, Nigeria", image: "https://res.cloudinary.com/fccjt5sr/image/upload/v1794169950/Tamunoemi_Ibrahim.png" },
  { name: "Franklin Oladipo", role: "Technical Director", location: "United Kingdom", image: "https://res.cloudinary.com/fccjt5sr/image/upload/v1794170083/Franklin_Oladipo.jpg" },
  { name: "Sandra Okoh", role: "Programme Coordinator", location: "Lagos, Nigeria", image: "https://res.cloudinary.com/fccjt5sr/image/upload/v1794169951/Sandra_Okoh_1.jpg" },
  { name: "Idris Bankole", role: "Technical Programme Coordinator", location: "Lagos, Nigeria", image: "https://res.cloudinary.com/fccjt5sr/image/upload/v1794169950/idris_bankole.jpg" },
  { name: "Faleto Adeoye", role: "Workforce Coordinator", location: "Lagos, Nigeria", image: "https://res.cloudinary.com/fccjt5sr/image/upload/v1794169951/Faleto_Adeoye_1.jpg" },
  { name: "Chioma Favour Ojo", role: "Manager, The Tech Paragon", location: "Lagos, Nigeria", image: "https://res.cloudinary.com/fccjt5sr/image/upload/v1794169950/Chioma_Favour_Ojo.jpg" },
];

/* -------------------------------------------------------------------------- */
/* Programmes                                                                 */
/* -------------------------------------------------------------------------- */

export type Initiative = {
  /** Anchor on /programmes, e.g. /programmes#tech-paragon */
  id: string;
  title: string;
  tag: string;
  /** One string per paragraph, or a single paragraph. */
  text: string | string[];
  points: string[];
  image?: { src: string; alt: string; width: number; height: number };
  cta?: Link;
};

export const programmes = {
  intro: {
    eyebrow: "Programmes and initiatives",
    title: "Pathways from potential to productivity",
    text: "We develop human potential, expand opportunities and build pathways to sustainable economic productivity through education, skills development, mentorship and strategic empowerment.",
  },
  focusAreas: [
    {
      title: "Human capital development",
      text: "The mindset, character, knowledge, practical skills and leadership capacity people need to thrive personally, professionally and economically.",
    },
    {
      title: "Education support",
      text: "Expanding access to education for disadvantaged people through learning opportunities, resources and future scholarship initiatives.",
    },
    {
      title: "Talent development",
      text: "Identifying and nurturing exceptional talent in agriculture, science, technology and innovation.",
    },
    {
      title: "Entrepreneurship and enterprise",
      text: "Business education, mentorship, financial literacy and future enterprise funding for aspiring entrepreneurs.",
    },
  ] satisfies TitledText[],
  initiatives: [
    {
      id: "transformation",
      title: "JCTEF Transformation Programme",
      tag: "Flagship · 3 months",
      text: "A structured human capital development programme built on the belief that transformation precedes empowerment. Fellows move through the six programme stages, measured by the JCTEF Human Capital Index.",
      points: [
        "Self-discovery and personal development",
        "Mental fitness and resilience",
        "Digital and workplace readiness",
        "Financial literacy and wealth creation",
        "Entrepreneurship and economic empowerment",
        "Technical, vocational and industrial skills",
        "Mentorship and personal growth",
      ],
      cta: { label: "Become a JCTEF fellow", href: "/institute#fellow" },
    },
    {
      id: "young-minds",
      title: "JCTEF Young Minds Initiative",
      tag: "Secondary schools",
      text: "A school-based student development and wellbeing programme supporting young people as they navigate adolescence, school, relationships, technology and personal growth. Support them where they are; equip them for where they are going.",
      points: [
        "Emotional wellbeing: awareness, healthy coping, resilience and asking for help",
        "Healthy relationships: relating to others and responding to peer pressure",
        "Digital life and technology: living responsibly and positively online",
        "Learning and personal growth: practical habits, confidence and responsibility",
      ],
    },
    {
      id: "campus",
      title: "Campus Transformation and Wellness Initiative",
      tag: "Universities and tertiary institutions",
      text: "Student outreach that supports wellbeing, informed decision-making and future readiness through the transition into adulthood.",
      points: [
        "Mental health and student wellbeing",
        "Substance abuse awareness and prevention",
        "Career and future readiness",
      ],
    },
    {
      id: "summit",
      title: "JCTEF Business Summit",
      tag: "Annual event",
      text: "An annual event connecting people and possibilities around talent, entrepreneurship, start-ups, funding, innovation and economic opportunity.",
      points: [
        "Entrepreneurship and enterprise development",
        "Business strategy and growth",
        "Financial literacy and business finance",
        "Innovation and digital transformation",
        "Networking and market opportunities",
        "Talent and business exhibition",
      ],
    },
    {
      id: "retreat",
      title: "JCTEF Annual Retreat",
      tag: "Year-end · Reflect. Recalibrate. Rebuild.",
      text: "A year-end retreat to pause, reflect, recalibrate and prepare for the year ahead, connecting personal reflection with practical planning, wellbeing and networking.",
      points: [
        "Reflection and year review",
        "Wellbeing and unwinding",
        "Goal setting and strategic planning",
        "Connection and accountability",
      ],
      cta: {
        label: "Register for RESET 2027",
        href: "https://bit.ly/Reset2027",
      },
    },
    {
      id: "tech-paragon",
      title: "Women in Tech: The Tech Paragon",
      tag: "Women in tech · Across Africa",
      text: [
        "Women in Tech: The Tech Paragon is an initiative that empowers women in tech to move from passive participants to active participants, growing them into tech leaders and builders of innovative tech solutions.",
        "Through a community of women in tech across Africa, members fix each other's crowns, supporting and encouraging one another. Most importantly, the initiative brings opportunities to women in tech to help them scale.",
        "It is built on a simple principle: when you empower a woman, you empower a nation. It also tackles the inequality and bias women face in the tech sector.",
      ],
      points: [
        "From passive to active participants in tech",
        "Growing tech leaders and builders of innovative solutions",
        "A supportive community of women in tech across Africa",
        "Opportunities that help women in tech scale",
        "Tackling inequality and bias in the tech sector",
      ],
      // TODO: Tech Paragon photo
      image: {
        src: "/images/tech-paragon-placeholder.svg",
        alt: "Placeholder illustration of a crown above a laptop, standing in for a photo of The Tech Paragon community",
        width: 1200,
        height: 800,
      },
      // TODO: confirm how women join (link, form or email)
      cta: { label: "Ask about joining", href: "/contact" },
    },
  ] as Initiative[],
  join: {
    eyebrow: "Eligibility",
    title: "How to join our Transformation Programme",
    text: "The Transformation Programme is free to join, thanks to our partners and donors. Every applicant goes through screening first.",
  },
  impactAreas: [
    {
      title: "Mental transformation",
      text: "Counselling and mindset workshops help young people overcome trauma, addiction and negative thought patterns.",
    },
    {
      title: "Skills development",
      text: "Hands-on training in digital skills, vocational trades and agriculture for employment and self-reliance.",
    },
    {
      title: "Economic empowerment",
      text: "Funding support helps graduates launch businesses and careers with sustainable income.",
    },
    {
      title: "Mentorship support",
      text: "Partner organisations provide real-world exposure through internships and ongoing mentorship.",
    },
    {
      title: "Education funding",
      text: "We fund formal and informal education for the less privileged.",
    },
    {
      title: "Continuous growth",
      text: "Regular check-ins, training upgrades and community networks sustain long-term success.",
    },
  ] satisfies TitledText[],
  eligibility: [
    {
      title: "Age",
      text: "Aged 7 to 45, at any life stage, and in need of support to transform and grow.",
    },
    {
      title: "Commitment to change",
      text: "Willing to take part in mindset, skills and personal development sessions with dedication and consistency.",
    },
    {
      title: "Background checks",
      text: "Complete our application, including background checks and interviews, for programme suitability and everyone's safety.",
    },
    {
      title: "Full participation",
      text: "Attend every scheduled session: counselling, training, mentorship and follow-up throughout the programme.",
    },
  ] satisfies TitledText[],
};

/* -------------------------------------------------------------------------- */
/* JCTEF Institute: Human Capital Transformation Framework                    */
/* -------------------------------------------------------------------------- */

export type FrameworkStage = {
  number: number;
  title: string;
  tagline?: string;
  summary?: string;
  points?: string[];
};

/** The nine stages of the JCTEF Human Capital Transformation Framework. */
export const frameworkStages: FrameworkStage[] = [
  {
    number: 1,
    title: "Self-Discovery, Identity & Cognitive Development",
    points: [
      "Identity and self-awareness",
      "Belief systems",
      "Purpose and direction",
      "Values, strengths and potential",
    ],
  },
  {
    number: 2,
    title: "Mental Fitness, Emotional Wellbeing & Resilience",
    tagline: "Develop the capacity to function, adapt and thrive.",
    points: [
      "Emotional intelligence",
      "Emotional regulation",
      "Emotional wellbeing and recovery from difficult experiences",
      "Resilience",
      "Stress management",
    ],
  },
  {
    number: 3,
    title: "Relationship Capital & Networking",
    tagline: "Know how to connect.",
  },
  {
    number: 4,
    title: "Digital & Foundational Literacy",
    points: [
      "Digital competency",
      "Workplace technology awareness",
      "Digital communication",
      "Practical use of productivity and collaboration tools",
    ],
  },
  {
    number: 5,
    title: "Workforce Readiness",
    points: [
      "CV development",
      "Interview preparation",
      "Workplace professionalism",
      "Communication",
      "Teamwork",
      "Workplace ethics",
      "Career readiness",
    ],
  },
  {
    number: 6,
    title: "Financial Literacy & Wealth Creation",
    tagline:
      "Understand money, make smarter financial decisions, and learn the principles of building wealth.",
  },
  {
    number: 7,
    title: "Technical & Vocational Skills",
    tagline:
      "Practical, industry-relevant skills for employment and enterprise.",
  },
  {
    number: 8,
    title: "Marketing & Selling Your Skills, Products and Services",
    tagline: "Turning your value into income.",
  },
  {
    number: 9,
    title: "Economic Placement & Enterprise Development",
    tagline: "Turn your capabilities into opportunities.",
    summary:
      "This stage focuses on moving from capability to economic participation.",
  },
];

/* -------------------------------------------------------------------------- */
/* JCTEF Institute                                                            */
/* -------------------------------------------------------------------------- */

export const institute = {
  intro: {
    eyebrow: "JCTEF Institute",
    title:
      "Advancing human capital through learning, frameworks and innovation",
    text: "The JCTEF Institute for Human Capital Development is the knowledge and framework division of the foundation. We develop evidence-informed frameworks, learning resources and practical methods that strengthen human capital, improve workforce readiness and promote sustainable economic productivity.",
    tags: [
      "Human capital development",
      "Transformation frameworks",
      "Learning resources",
      "Workforce readiness",
      "Human Capital Index",
      "Innovation",
    ],
  },
  why: {
    title: "Why the Institute exists",
    text: "Many empowerment initiatives focus mainly on providing resources. We believe lasting empowerment begins with personal transformation. The Institute develops, implements and stewards the JCTEF Human Capital Transformation Framework, so every programme follows a structured, measurable path.",
  },
  pillars: [
    {
      title: "Human capital development",
      text: "Personal growth, leadership, workforce readiness and lifelong learning.",
    },
    {
      title: "Framework and programme development",
      text: "Frameworks, curricula, assessment tools and methods that guide every JCTEF programme.",
    },
    {
      title: "Learning and capacity building",
      text: "Structured learning, workshops, mentorship and resources for employment, enterprise and citizenship.",
    },
  ] satisfies TitledText[],
  framework: {
    eyebrow: "The framework",
    title: "A structured pathway from potential to productivity",
    text: "The JCTEF Human Capital Transformation Framework is the Institute's own method for developing people through personal transformation, capacity building and economic readiness.",
  },
  jhci: {
    eyebrow: "Measuring what matters",
    title: "The JCTEF Human Capital Index (JHCI)",
    text: "We measure transformation, not just attendance. The JHCI is the Institute's assessment framework for tracking each fellow's growth from baseline to graduation and beyond.",
    dimensions: [
      {
        title: "Mindset and personal growth",
        text: "Self-awareness, confidence, resilience and discipline.",
      },
      {
        title: "Competency development",
        text: "Practical knowledge, transferable skills and workplace competencies.",
      },
      {
        title: "Workforce readiness",
        text: "Employability, professionalism, communication and teamwork.",
      },
      {
        title: "Financial capability",
        text: "Financial literacy, entrepreneurship and responsible decisions.",
      },
      {
        title: "Technical and vocational competence",
        text: "Proficiency in the technical or trade skills learned.",
      },
      {
        title: "Economic readiness",
        text: "Preparedness for employment, enterprise or other productive work.",
      },
    ] satisfies TitledText[],
  },
  serves: [
    {
      title: "Students and graduates",
      text: "Preparing young people for academic, career and personal success.",
    },
    {
      title: "Job seekers and young professionals",
      text: "Competence and confidence for meaningful employment.",
    },
    {
      title: "Aspiring entrepreneurs",
      text: "Support to build sustainable small businesses.",
    },
    {
      title: "Orphans, vulnerable youth and school dropouts",
      text: "Personal development, education support and skills training.",
    },
    {
      title: "Communities and development practitioners",
      text: "Community initiatives for human capital and productivity.",
    },
    {
      title: "Educators, trainers and facilitators",
      text: "Strengthening those who develop and mentor others.",
    },
  ] satisfies TitledText[],
  fellow: {
    eyebrow: "Become a JCTEF fellow",
    title: "Ready to transform your life?",
    text: "If you are seeking transformation, new skills or empowerment support, take the first step towards becoming a mentally strong, skilled and self-reliant nation-builder. Join the next available cohort.",
    steps: [
      { label: "Apply", hint: "Email or call us" },
      { label: "Screening", hint: "Interview and checks" },
      { label: "Baseline JHCI", hint: "Where you start" },
      { label: "Cohort", hint: "Three months" },
      { label: "Ongoing support", hint: "Mentorship and funding" },
    ],
    // TODO: is there an online application form? Until then, applications go to program@jctef.org.
    cta: {
      label: "Apply by email",
      href: "mailto:program@jctef.org?subject=JCTEF%20fellowship%20application",
    },
  },
};

/* -------------------------------------------------------------------------- */
/* Get involved                                                               */
/* -------------------------------------------------------------------------- */

/** Anchor of the volunteer application form on /get-involved. */
const volunteerForm = "#volunteer-form";

/** Options for the volunteer form. The values are what the team sees in the
 * emails and in Brevo, so keep them readable. */
export const volunteerRoles = ["Programme facilitator", "Mentor", "Events and outreach", "General volunteer"] as const;
export const volunteerAvailability = ["Weekdays", "Weekends", "Evenings", "Flexible"] as const;

/** Organisation types for the partnership enquiry form. */
export const partnerOrgTypes = [
  "Educational institution",
  "Corporate or industry partner",
  "Development or nonprofit organisation",
  "Trainer, mentor or expert",
  "Government agency",
  "Faith-based organisation",
  "Philanthropist or individual",
  "Other",
] as const;
export type PartnerOrgType = (typeof partnerOrgTypes)[number];

export const getInvolved = {
  intro: {
    eyebrow: "Get involved",
    title: "Join us in transforming lives",
    text: "Transformation happens through collective action. Whether you volunteer, mentor, partner or sponsor, everyone has a part to play in building a more productive and empowered society.",
  },
  volunteer: {
    eyebrow: "Volunteer",
    title: "Ways you can volunteer",
    text: "Give your expertise, time and passion to create meaningful impact.",
    formUrl: volunteerForm,
    form: {
      eyebrow: "Apply",
      title: "Apply to volunteer",
      text: "Tell us a little about yourself and how you would like to help. We read every application and will get back to you by email.",
      roleLegend: "I'd like to volunteer as",
      areasLegend: "Which areas could you facilitate?",
      areasHint: "Choose any that fit. These are the stages of our framework.",
      areasLink: { label: "What each stage covers", href: "/institute#framework" },
      consentContact: "I agree to JCTEF contacting me about my application.",
      // TODO: JCTEF to confirm minimum volunteer age and safeguarding checks
      consentAge: "I am 18 or older.",
      submit: "Send application",
      sending: "Sending…",
      success: (firstName: string, email: string) =>
        `Thank you, ${firstName}. We've emailed a confirmation to ${email}.`,
      error: "Something went wrong. Please try again, or email info@jctef.org.",
    },
    facilitator: {
      title: "Volunteer as a programme facilitator",
      text: "Share your expertise by facilitating sessions in our Transformation Programme. Facilitators lead sessions in areas such as self-discovery, mental fitness, digital and foundational literacy, workforce readiness, financial literacy and more.",
      cta: {
        label: "See the areas you can facilitate",
        href: "/institute#framework",
      },
      apply: { label: "Apply to volunteer", href: volunteerForm },
    },
    roles: [
      {
        title: "Mentorship and career guidance",
        tagline: "Share your experience. Shape someone's future.",
        text: "Support fellows with personal development, career direction, goal setting and professional growth.",
      },
      {
        title: "Mental wellness support",
        tagline: "Help people build emotional resilience.",
        text: "Licensed therapists, counsellors and mental health professionals can lead mental fitness and wellbeing sessions.",
      },
      {
        title: "Skills and technical training",
        tagline: "Teach skills that create opportunities.",
        text: "Deliver practical training in digital skills, vocational trades, entrepreneurship or your industry.",
      },
      {
        title: "Administration and operations",
        tagline: "Strengthen the systems behind the mission.",
        text: "Help with administration, project coordination, communications, documentation and research.",
      },
      {
        title: "Digital and creative support",
        tagline: "Use your creativity to amplify impact.",
        text: "Contribute web development, design, content, social media or photography skills.",
      },
      {
        title: "Community outreach",
        tagline: "Help us reach more people.",
        text: "Support awareness campaigns, events and community initiatives that connect people with opportunity.",
      },
    ],
    benefits: [
      {
        title: "Recognition",
        text: "Volunteer recognition and acknowledgement for your contribution.",
      },
      {
        title: "Growth and networking",
        text: "Meet professionals and changemakers while building new skills.",
      },
      {
        title: "Leadership",
        text: "Grow into leadership roles and help shape JCTEF initiatives.",
      },
      {
        title: "Recommendation",
        text: "Outstanding volunteers may receive recommendation letters.",
      },
    ] satisfies TitledText[],
  },
  partner: {
    eyebrow: "Partner",
    title: "Building stronger human capital together",
    text: "We partner with government agencies, companies, educational institutions, development partners, NGOs, faith-based organisations and philanthropists.",
    groups: [
      {
        title: "Educational institutions",
        tagline: "Expanding access to learning",
        items: [
          "Joint training programmes",
          "Professional certification",
          "Learning resources",
          "Guest lectures and workshops",
          "Educational sponsorships",
        ],
      },
      {
        title: "Corporate and industry partners",
        tagline: "Creating employment pathways",
        items: [
          "Jobs and graduate recruitment",
          "Internship placements",
          "Apprenticeships",
          "Workplace mentorship",
          "Industry-led training",
        ],
      },
      {
        title: "Development and nonprofit organisations",
        tagline: "Supporting transformation through investment",
        items: [
          "Sponsor fellows' training",
          "Fund vocational skills",
          "Scholarships and education support",
          "Programme sponsorship",
          "Start-up grants",
        ],
      },
      {
        title: "Trainers, mentors and experts",
        tagline: "Sharing knowledge, building capacity",
        items: [
          "Facilitate training sessions",
          "Mentor fellows",
          "Develop learning resources",
          "Review curricula",
          "Career guidance",
        ],
      },
    ],
    benefits: [
      {
        title: "Shared vision",
        text: "Work with an organisation committed to sustainable empowerment.",
      },
      {
        title: "Meaningful social impact",
        text: "Equip people to become productive contributors to society.",
      },
      {
        title: "Talent pipeline",
        text: "Meet trained, job-ready fellows for internships and employment.",
      },
      {
        title: "Transparency",
        text: "Regular updates on delivery, fellow progress and the impact of your support.",
      },
      {
        title: "Community development",
        text: "Strengthen education, skills, enterprise and economic inclusion.",
      },
      {
        title: "CSR recognition",
        text: "Show your commitment to responsible corporate citizenship.",
      },
    ] satisfies TitledText[],
    form: {
      title: "Start a partnership",
      text: "Tell us about your organisation and the partnership you have in mind. Our partnerships team will get back to you.",
      orgTypeLabel: "Organisation type",
      areasLegend: "Areas of interest",
      areasHint: "Choose any that fit.",
      areasHintNoType: "Choose an organisation type above to see options for it.",
      consent: "I agree to JCTEF contacting me about this enquiry.",
      submit: "Send enquiry",
      sending: "Sending…",
      success: (firstName: string) => `Thank you, ${firstName}. Our partnerships team will be in touch.`,
      error: (email: string) => `Something went wrong. Please try again, or email ${email}.`,
      fallback: "Prefer email? Write to",
    },
    cta: {
      label: "Become a partner",
      href: "#partner-form",
    },
  },
  fellow: {
    eyebrow: "Become a fellow",
    title: "Ready to transform your own life?",
    // TODO: confirm with JCTEF team ("quarterly Transformation Cohorts")
    text: "Our quarterly Transformation Cohorts are open to educated and non-educated people who are committed to growth.",
    cta: { label: "How to become a fellow", href: "/institute#fellow" },
  },
  donate: {
    eyebrow: "Donate",
    title: "Your gift is an investment in human potential",
    text: "Donations fund training, technical and vocational skills, mentorship, education support and start-up grants for young people who need a first step.",
    cta: { label: "Donate with Flutterwave", href: site.donateUrl },
    // Flutterwave only (JCTEF team decision): no bank details on the site.
  },
};

/* -------------------------------------------------------------------------- */
/* Contact + blog                                                             */
/* -------------------------------------------------------------------------- */

/**
 * "Areas of interest" options for the partnership form, built from the
 * partner cards above. Types without their own card (and no selection) get a
 * mix of the most common asks across all cards.
 */
const partnerTypeToGroup: Partial<Record<PartnerOrgType, string>> = {
  "Educational institution": "Educational institutions",
  "Corporate or industry partner": "Corporate and industry partners",
  "Development or nonprofit organisation": "Development and nonprofit organisations",
  "Trainer, mentor or expert": "Trainers, mentors and experts",
  "Philanthropist or individual": "Development and nonprofit organisations",
};
const commonPartnerAreas = [
  "Programme sponsorship",
  "Sponsor fellows' training",
  "Internship placements",
  "Mentor fellows",
  "Joint training programmes",
  "Scholarships and education support",
];
export function partnerAreasFor(type?: string): string[] {
  const group = getInvolved.partner.groups.find((g) => g.title === partnerTypeToGroup[type as PartnerOrgType]);
  return group ? group.items : commonPartnerAreas;
}
/** Every option the form can show (for server-side validation). */
export const allPartnerAreas = [...new Set(getInvolved.partner.groups.flatMap((g) => g.items))];

export const contact = {
  eyebrow: "Contact us",
  title: "Say hello",
  text: "Whether you are a young person looking for a fresh start, a potential partner or someone who wants to support our mission, we would love to hear from you.",
};

export const blog = {
  eyebrow: "Blog",
  title: "News and stories",
  text: "Updates from our fellows, programmes, events and research.",
  // Posts live in content/blog/<slug>.mdx (migrated from the old WordPress site).
};
