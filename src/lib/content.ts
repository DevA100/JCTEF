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
export type Social = {
  label: string;
  /** null = not shown until the team confirms the right account. */
  href: string | null;
};
export type JctefEvent = {
  slug: string;
  title: string;
  subtitle?: string;
  /** ISO 8601 with the Lagos offset (WAT, +01:00), or null if not set yet. */
  startsAt: string | null;
  /** Human-readable date line, e.g. "Saturday 12 December 2026". */
  dateLabel: string;
  timeLabel?: string;
  location: string;
  summary: string;
  cta?: Link;
  image?: { src: string; alt: string; width: number; height: number };
};
export type Testimonial = { quote: string; name: string; role: string; photo?: string };
export type BlogPost = { slug: string; title: string; excerpt: string; date: string };

/* -------------------------------------------------------------------------- */
/* Site-wide                                                                  */
/* -------------------------------------------------------------------------- */

export const site = {
  name: "Jacob Chidimma Transformation and Empowerment Foundation",
  shortName: "JCTEF",
  tagline: "Transform, Equip, Empower",
  coreMessage: "From dependency to productivity",
  description:
    "JCTEF is a youth-focused nonprofit in Lekki, Lagos, helping young people move from dependency to productivity through mindset transformation, skills training, mentorship and access to funding.",
  url: "https://jctef.org",
  donateUrl: "https://flutterwave.com/donate/1pci95j4kyk9",
  address: "Lekki, Lagos, Nigeria", // TODO: add a full street address if the office can be listed publicly.
  email: "info@jctef.org",
  phone: "+234 815 171 4278",
  phoneHref: "tel:+2348151714278",
  // TODO: confirm this is also the number JCTEF uses for WhatsApp.
  whatsapp: "+234 815 171 4278",
  whatsappMessage: "Hello JCTEF, I'd like to find out more about your programmes.",
  hours: "Monday to Friday, 9:00am to 5:00pm WAT",
  enquiries: [
    { label: "General enquiries", email: "info@jctef.org" },
    { label: "Youth applications", email: "program@jctef.org" },
    { label: "Training information", email: "training@jctef.org" },
    { label: "Partnerships", email: "partner@jctef.org" },
    { label: "Donations and support", email: "donate@jctef.org" },
    { label: "Volunteering", email: "info@jctef.org" },
  ],
  // TODO: the old site's Facebook, X and LinkedIn links point to "CDM"
  // accounts (cdmcommunity, CDM_Group, cdm-foundation). Send the correct
  // JCTEF links; they stay hidden until then.
  socials: [
    // TODO: the old site lists two Instagram accounts: @official_jctef
    // (footer) and @jacobchidimmafoundation (contact page). Which is current?
    { label: "Instagram", href: "https://www.instagram.com/official_jctef/" },
    { label: "YouTube", href: "https://www.youtube.com/@jctef" },
    { label: "Facebook", href: null },
    { label: "X (Twitter)", href: null },
    { label: "LinkedIn", href: null },
  ] satisfies Social[],
} as const;

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
    { label: "Partner with us", href: "/get-involved#partner" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ] satisfies Link[],
};

/* -------------------------------------------------------------------------- */
/* Shared building blocks                                                     */
/* -------------------------------------------------------------------------- */

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

/** The six programme stages: the journey from dependency to productivity. */
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

/** Who JCTEF serves (homepage version). */
export const audiences: TitledText[] = [
  {
    // TODO: the old site says "ages 2–45" (almost certainly a typo). The
    // RESET 2027 poster says 18–45. Please confirm the target age range.
    title: "Young people aged 18 to 45",
    text: "Youth at different life stages who are ready to move from dependency to productivity.",
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
  "To become a globally recognised organisation for human transformation, advancing human capital development through education, research, innovation and practical empowerment, while raising a generation of purpose-driven, productive and economically independent individuals who transform communities and nations.";

export const mission =
  "To help individuals discover their potential, develop their human capital, strengthen their minds, acquire marketable skills and become productive contributors who create lasting value for themselves, their communities and society.";

export const coreValues: TitledText[] = [
  { title: "Transformation", text: "Lasting change begins on the inside, so we start with mindset." },
  { title: "Empathy", text: "We meet people where they are, without labels or judgement." },
  { title: "Integrity", text: "We do what we say, and we are honest about what we have done." },
  { title: "Accountability", text: "We report progress to fellows, partners and donors alike." },
  { title: "Excellence", text: "We hold our programmes, and ourselves, to a high standard." },
  { title: "Innovation", text: "We test new ideas and keep what works for young people." },
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

// TODO: the old site repeated one placeholder testimonial three times. Add
// real, consented quotes from fellows (name, role, optional photo) here.
export const testimonials: Testimonial[] = [];

/* -------------------------------------------------------------------------- */
/* Homepage                                                                   */
/* -------------------------------------------------------------------------- */

export const home = {
  hero: {
    eyebrow: "Transform, Equip, Empower",
    title: "From dependency to productivity",
    text: "Structured programmes that take young people in Lagos through mindset transformation, hands-on skills, mentorship and access to funding, so they can build economic resilience and lead purposeful lives.",
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
      "Before people can change their circumstances, they must first change the way they think, grow in their capabilities and discover their purpose. So we help young people move from dependency to productivity, from unemployment to opportunity and from potential to purpose.",
    ],
    cta: { label: "Learn more about us", href: "/about" },
  },
  journey: {
    eyebrow: "The journey",
    title: "Six stops from dependency to productivity",
    text: "Every JCTEF fellow follows the same structured route. Nobody is dropped off halfway.",
    start: "Dependency",
    end: "Productivity",
    cta: { label: "See how the programme works", href: "/programmes" },
  },
  audiences: {
    eyebrow: "Who we serve",
    title: "Built for the young people others overlook",
  },
  impact: {
    eyebrow: "Our impact so far",
    title: "Our first cohort",
    text: "We are a young foundation and we would rather show you honest numbers than big ones. Here is where we are after our first year.",
    // TODO: confirm these figures (carried over from the old site's
    // counters: 1+ years, 30+ youth, 2+ partners, 2+ projects).
    stats: [
      { value: "30+", label: "young people empowered" },
      { value: "2", label: "partner organisations" },
      { value: "2", label: "projects completed" },
      { value: "1", label: "year of service" },
    ],
    footnote: "Cohort 1 of the JCTEF Transformation Programme began on 15 August 2026.",
  },
  values: {
    eyebrow: "Our direction",
    title: "Vision, mission and core values",
  },
  events: {
    eyebrow: "Upcoming events",
    title: "Come and meet us",
    countdownLabel: "Time until RESET 2027",
  },
  partners: {
    eyebrow: "Partnerships",
    title: "We cannot do this alone",
    text: "Lasting transformation is built together. We partner with organisations that share our belief in young people.",
    cta: { label: "Partner with us", href: "/get-involved#partner" },
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
        cta: { label: "Partner with us", href: "/get-involved#partner" },
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
    consent: "I agree to receive updates, publications and newsletters from JCTEF.",
  },
};

/* -------------------------------------------------------------------------- */
/* Events                                                                     */
/* -------------------------------------------------------------------------- */

export const events: JctefEvent[] = [
  {
    slug: "reset-2027",
    title: "RESET 2027: JCTEF Annual Retreat",
    subtitle: "Reflect. Recalibrate. Rebuild.",
    startsAt: "2026-12-12T11:00:00+01:00",
    dateLabel: "Saturday 12 December 2026",
    timeLabel: "11:00am to 5:00pm WAT",
    // TODO: add the venue once it is announced.
    location: "Lagos (venue to be announced)",
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
      "Through human capital development, skills acquisition, mentorship, workforce development, entrepreneurship support, financial literacy, capacity building and access to funding, we help young people move from dependency to productivity, from unemployment to opportunity and from potential to purpose.",
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
    title: "Built on a passion to see people become the best version of themselves",
    text: [
      "Over the years, I have watched people lose their confidence, their joy and sometimes their sense of purpose. Not because they lacked value, but because they never had the opportunity, guidance or environment to discover what they were capable of becoming.",
      "Human potential is one of the world's greatest resources, yet one of its most underdeveloped. That conviction became the foundation of JCTEF.",
      "Our mission is not simply to empower people. It is to walk alongside them, providing guidance, practical tools, mentorship and opportunities that turn potential into productivity, purpose and lasting impact.",
    ],
    affirmations: ["We believe in you.", "We see your potential.", "You matter.", "See you at the top!"],
  },
  faq: [
    {
      q: "How can I join a JCTEF programme?",
      a: [
        "JCTEF runs quarterly Transformation Cohorts: our flagship three-month human capital development programme. It is open to both educated and non-educated people who are committed to personal growth.",
        "Every applicant goes through screening and assessment. Selected fellows complete baseline and periodic evaluations using the JCTEF Human Capital Index (JHCI). Outstanding fellows may receive extra support, including skills training, mentorship, start-up support and access to funding, depending on eligibility and availability.",
      ],
    },
    {
      q: "Are JCTEF programmes free?",
      a: [
        "Many of our programmes are free, thanks to our partners, sponsors and donors. Some specialised programmes have their own eligibility or registration requirements.",
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
        "We are based in Lekki, Lagos. As the foundation grows, we aim to reach more regions across Nigeria.",
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
        "I learned that true transformation begins from within. Through faith, continuous learning and self-reflection, I broke free from limiting beliefs. As my mindset changed, new opportunities followed: I moved into software engineering and built a career in banking.",
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

/* -------------------------------------------------------------------------- */
/* Programmes                                                                 */
/* -------------------------------------------------------------------------- */

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
      cta: { label: "Register for RESET 2027", href: "https://bit.ly/Reset2027" },
    },
  ],
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
      // TODO: confirm the age range (old site: "2–45"; RESET poster: 18–45).
      title: "Age",
      text: "Aged 18 to 45, at any life stage, and in need of support to transform and grow.",
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
/* JCTEF Institute                                                            */
/* -------------------------------------------------------------------------- */

export const institute = {
  intro: {
    eyebrow: "JCTEF Institute",
    title: "Advancing human capital through learning, frameworks and innovation",
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
    stages: [
      { title: "Self-discovery", text: "Identity, strengths, purpose, values and potential." },
      { title: "Mental fitness", text: "Resilience, discipline, confidence, emotional intelligence and a growth mindset." },
      { title: "Digital and foundational skills", text: "Digital literacy, communication, problem-solving and workplace basics." },
      { title: "Workforce readiness", text: "Professionalism, career development, leadership, teamwork and ethics." },
      { title: "Financial literacy", text: "Money management, entrepreneurship and wealth-building habits." },
      { title: "Technical and vocational skills", text: "Practical, industry-relevant skills for employment and enterprise." },
      { title: "Economic productivity", text: "Moving into jobs, enterprise and other productive opportunities." },
    ] satisfies TitledText[],
  },
  jhci: {
    eyebrow: "Measuring what matters",
    title: "The JCTEF Human Capital Index (JHCI)",
    text: "We measure transformation, not just attendance. The JHCI is the Institute's assessment framework for tracking each fellow's growth from baseline to graduation and beyond.",
    dimensions: [
      { title: "Mindset and personal growth", text: "Self-awareness, confidence, resilience and discipline." },
      { title: "Competency development", text: "Practical knowledge, transferable skills and workplace competencies." },
      { title: "Workforce readiness", text: "Employability, professionalism, communication and teamwork." },
      { title: "Financial capability", text: "Financial literacy, entrepreneurship and responsible decisions." },
      { title: "Technical and vocational competence", text: "Proficiency in the technical or trade skills learned." },
      { title: "Economic readiness", text: "Preparedness for employment, enterprise or other productive work." },
    ] satisfies TitledText[],
  },
  serves: [
    { title: "Students and graduates", text: "Preparing young people for academic, career and personal success." },
    { title: "Job seekers and young professionals", text: "Competence and confidence for meaningful employment." },
    { title: "Aspiring entrepreneurs", text: "Support to build sustainable small businesses." },
    { title: "Orphans, vulnerable youth and school dropouts", text: "Personal development, education support and skills training." },
    { title: "Communities and development practitioners", text: "Community initiatives for human capital and productivity." },
    { title: "Educators, trainers and facilitators", text: "Strengthening those who develop and mentor others." },
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
    cta: { label: "Apply by email", href: "mailto:program@jctef.org?subject=JCTEF%20fellowship%20application" },
  },
};

/* -------------------------------------------------------------------------- */
/* Get involved                                                               */
/* -------------------------------------------------------------------------- */

const volunteerForm =
  "https://docs.google.com/forms/d/e/1FAIpQLSelTaCz81BOftTaYXsYBufH4F-tskxsA5a3P0ikLuMtIP54hg/viewform";

export const getInvolved = {
  intro: {
    eyebrow: "Get involved",
    title: "Join us in transforming lives",
    text: "Transformation happens through collective action. Whether you volunteer, mentor, partner or give, everyone has a part to play in building a more productive and empowered society.",
  },
  volunteer: {
    eyebrow: "Volunteer",
    title: "Ways you can volunteer",
    text: "Give your expertise, time and passion to create meaningful impact.",
    formUrl: volunteerForm,
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
      { title: "Recognition", text: "Volunteer recognition and acknowledgement for your contribution." },
      { title: "Growth and networking", text: "Meet professionals and changemakers while building new skills." },
      { title: "Leadership", text: "Grow into leadership roles and help shape JCTEF initiatives." },
      { title: "Recommendation", text: "Outstanding volunteers may receive recommendation letters." },
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
        items: ["Joint training programmes", "Professional certification", "Learning resources", "Guest lectures and workshops", "Educational sponsorships"],
      },
      {
        title: "Corporate and industry partners",
        tagline: "Creating employment pathways",
        items: ["Jobs and graduate recruitment", "Internship placements", "Apprenticeships", "Workplace mentorship", "Industry-led training"],
      },
      {
        title: "Development and nonprofit organisations",
        tagline: "Supporting transformation through investment",
        items: ["Sponsor fellows' training", "Fund vocational skills", "Scholarships and education support", "Programme sponsorship", "Start-up grants"],
      },
      {
        title: "Trainers, mentors and experts",
        tagline: "Sharing knowledge, building capacity",
        items: ["Facilitate training sessions", "Mentor fellows", "Develop learning resources", "Review curricula", "Career guidance"],
      },
    ],
    benefits: [
      { title: "Shared vision", text: "Work with an organisation committed to sustainable empowerment." },
      { title: "Meaningful social impact", text: "Equip people to become productive contributors to society." },
      { title: "Talent pipeline", text: "Meet trained, job-ready fellows for internships and employment." },
      { title: "Transparency", text: "Regular updates on delivery, fellow progress and the impact of your support." },
      { title: "Community development", text: "Strengthen education, skills, enterprise and economic inclusion." },
      { title: "CSR recognition", text: "Show your commitment to responsible corporate citizenship." },
    ] satisfies TitledText[],
    cta: { label: "Email our partnerships team", href: "mailto:partner@jctef.org?subject=Partnering%20with%20JCTEF" },
  },
  fellow: {
    eyebrow: "Become a fellow",
    title: "Ready to transform your own life?",
    text: "Our quarterly Transformation Cohorts are open to educated and non-educated people who are committed to growth.",
    cta: { label: "How to become a fellow", href: "/institute#fellow" },
  },
  donate: {
    eyebrow: "Donate",
    title: "Your gift is an investment in human potential",
    text: "Donations fund training, technical and vocational skills, mentorship, education support and start-up grants for young people who need a first step.",
    cta: { label: "Donate with Flutterwave", href: site.donateUrl },
    // TODO: add bank transfer details for donors who prefer them, if any.
  },
};

/* -------------------------------------------------------------------------- */
/* Contact + blog                                                             */
/* -------------------------------------------------------------------------- */

export const contact = {
  eyebrow: "Contact us",
  title: "Say hello",
  text: "Whether you are a young person looking for a fresh start, a potential partner or someone who wants to support our mission, we would love to hear from you.",
};

export const blog = {
  eyebrow: "Blog",
  title: "News and stories",
  text: "Updates from our fellows, programmes, events and research.",
  // TODO: migrate posts from the old WordPress blog (jctef.org/blog), or add new ones here.
  posts: [] as BlogPost[],
};
