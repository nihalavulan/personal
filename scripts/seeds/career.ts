import { connect, disconnect } from "../db";
import { Experience, Project, Profile } from "../../src/models";

/**
 * Seeds career (Experience) + all Projects from Nihal's raw "databrain" dump.
 *
 * Design note: this stores RAW, faithful information — not polished portfolio
 * copy. The problem → approach → decisions → result thinking for each entry is
 * preserved under `metadata.raw` so it can later be transformed into concise
 * visual case studies without losing anything.
 *
 * Idempotent: Experiences keyed by (org, role), Projects keyed by slug.
 * Run with:  npm run seed:career
 */

const experiences = [
  {
    org: "Mapout",
    role: "Full Stack Developer",
    employmentType: "Full-time",
    startDate: new Date("2022-03-01"),
    endDate: new Date("2025-01-01"), // ~3 years; approximate
    current: false,
    order: 1,
    status: "published",
    summary:
      "Full-stack developer at Mapout (~3 years) — a platform connecting mentors, students/mentees, and employers to help students discover their career interests, skills, and paths. In a small ~10–11 person team, responsibilities were broad; I worked across frontend and backend and, as I earned ownership, independently ran meet.mapout.com and employer.mapout.com.",
    highlights: [
      "Built the logic + frontend for a psychometric career-assessment quiz (~20 questions → ~15 behaviour/interest-based career recommendations).",
      "Independently owned meet.mapout.com — a custom mentor–mentee video-calling platform (TypeScript + Twilio SDK) with mentee context, action tasks assigned between meetings, and mentoring-specific workflows rather than generic video calling.",
      "Independently owned employer.mapout.com — employer onboarding, talent-pool management, in-platform interviews, and an employability score that matched a student's profile against an employer's JD as a % match; plus a small accelerator-style job-experience program.",
      "Built AI learning in the React Native student app using OpenAI LLMs — generated 30/60-day structured learning plans pulling YouTube, reading, and project resources, presented Instagram-Stories-style with reminders to drive engagement.",
      "Worked on mentor–mentee payments and payment-gateway integrations across the platform's services (a separate backend dev covered other modules).",
    ],
    skills: [
      "React.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Next.js",
      "React Native",
      "TypeScript",
      "Twilio SDK",
      "OpenAI LLM APIs",
      "Payment gateways",
    ],
    metadata: {
      datesApproximate: true,
      teamSize: "~10–11 (incl. tech)",
      company:
        "Mapout — platform connecting mentors, mentees/students, and employers; helps students understand career interests, skills, and paths.",
      products: {
        careerAssessment:
          "Custom algorithmic psychological/behavioural quiz (~20 Qs) generating ~15 career recommendations from interest + behaviour patterns. Worked on both the testing logic and the frontend.",
        mentorMentee:
          "Mentor–mentee platform: connections, meetings, tasks/action projects, and mentoring workflows.",
        meet: {
          domain: "meet.mapout.com",
          desc: "Custom video-calling platform for mentor–mentee meetings (Google-Meet-like but purpose-built). Mentor sees mentee details, assigns action projects/tasks between meetings, customized mentoring workflow.",
          ownership: "Independent — both frontend and backend.",
          tech: ["TypeScript", "Twilio SDK (video)"],
          usage: "Functional, relatively small user base, also used internally.",
        },
        employer: {
          domain: "employer.mapout.com",
          desc: "Employer-facing side: detailed onboarding, talent-pool management, candidate management, in-platform interviews.",
          employabilityScore:
            "Evaluated a student's Mapout profile against an employer's Job Description to produce a % matchability/employability score.",
          jobExperienceProgram:
            "Smaller accelerator-style program letting students experience a role and understand the actual work.",
          ownership: "Independent — full-stack, main personal focus frontend.",
        },
        studentMobileAI:
          "React Native student app — job search + AI learning (OpenAI). Student enters a topic; AI generates a 30/60-day structured plan gathering YouTube/text/projects. Engagement via Stories-style content, interesting facts, reminders/notifications.",
        payments:
          "Mentor–mentee payment functionality and payment-gateway integrations across modules.",
      },
      techNotes: {
        nextjs: "Used in the admin dashboard.",
        typescript: "Specifically used for meet.mapout.com.",
      },
    },
  },
  {
    org: "GroupyGo",
    role: "Founder",
    employmentType: "Startup (founder)",
    startDate: new Date("2025-01-01"),
    endDate: new Date("2026-01-01"), // ~1 year; approximate
    current: false,
    order: 2,
    status: "published",
    summary:
      "Founded and built GroupyGo (~1 year), a WhatsApp-first B2B product organizing group/consolidated airfare information for small & medium travel agencies in Kerala. Grew to 300+ agencies and ~300–400 searches/day before shutting down. See the GroupyGo project for the full story.",
    highlights: [
      "Chose WhatsApp as the interface over a website/app to match existing user behaviour and cut adoption friction.",
      "Shipped an MVP (admin-managed data) to validate the problem before building the full marketplace.",
      "Reached 300+ agencies and ~300–400 searches/day; ~2s response to a structured query.",
    ],
    skills: ["Official WhatsApp API", "Node.js", "Express.js", "MongoDB"],
    metadata: { datesApproximate: true, seeProject: "groupygo" },
  },
  {
    org: "Independent / Freelance",
    role: "Full-Stack Developer & Product Engineer (Contract)",
    employmentType: "Contract / Freelance",
    startDate: new Date("2026-01-01"),
    endDate: null,
    current: true,
    order: 3,
    status: "published",
    summary:
      "~6 months of contract work. Model: a client brings a problem or requirement, I understand the actual problem, figure out how to implement a solution, iterate with the client, ship, and improve — optimizing for solving the problem efficiently rather than following a predefined spec. Projects: CapMyLead, Prime Circle, Reputup, Tradify, Aerobix, Macro Bowls.",
    highlights: [
      "Problem-first, not spec-first: understand the real need, then choose the minimum technology to solve it.",
      "Range spanned Flutter apps, embeddable widgets, conversion-focused landing pages, funnel/lead work, branding, and Telegram/n8n automation.",
    ],
    skills: [
      "Flutter",
      "Supabase",
      "Framer",
      "nas.io",
      "HTML",
      "Tailwind CSS",
      "n8n",
      "Meta Ads",
    ],
    metadata: {
      datesApproximate: true,
      projects: [
        "capmylead",
        "prime-circle",
        "reputup",
        "tradify",
        "aerobix",
        "macro-bowls",
      ],
    },
  },
];

const projects = [
  {
    title: "GroupyGo",
    slug: "groupygo",
    summary:
      "WhatsApp-first B2B product that organizes scattered group/consolidated airfare info for small & medium travel agencies in Kerala. Send a structured message (e.g. “CCJ DXB JAN 29”) → matching supplier tickets back in ~2s.",
    role: "Founder & Full-Stack Developer",
    org: "GroupyGo (own startup)",
    timeline: "~1 year",
    tags: ["startup", "travel", "b2b", "whatsapp", "mvp", "product"],
    tech: [
      "Official WhatsApp API",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Admin panel",
    ],
    featured: true,
    order: 1,
    status: "published",
    links: [],
    metadata: {
      projectType: "startup",
      stats: [
        { value: "300+", label: "travel agencies" },
        { value: "300–400", label: "searches / day" },
        { value: "~2s", label: "response time" },
        { value: "~1 yr", label: "in operation" },
      ],
      raw: {
        problem:
          "SME travel agencies in Kerala trade group/consolidated airfares B2B. A major channel was WhatsApp — agencies broadcast ticket availability/pricing across groups daily. Information was highly unorganized; finding a specific ticket meant manually scanning many messages across sources.",
        idea: "Organize the process: make searching for group/consolidated tickets fast and make the existing B2B WhatsApp workflow easier.",
        whyWhatsApp:
          "Target users already lived in WhatsApp; it was already their main channel; no new platform to learn; official WhatsApp API provided the needed capabilities.",
        mvpApproach:
          "Built an MVP first — not the full marketplace. Admin panel + team manually managed ticket/supplier data. Supplier dashboards planned later. Priority: validate the problem, usage, and demand before building everything.",
        howItWorked: [
          "Agency sends a structured WhatsApp message, e.g. 'CCJ DXB JAN 29'.",
          "System receives the request, parses sector/date, searches ticket data, identifies suppliers with matches, returns matching tickets (~2s).",
          "WhatsApp = frontend/interface; admin panel = manage ticket data.",
        ],
        decisions: [
          "WhatsApp-first instead of website/app — existing behaviour, familiar interface, lower friction, official API.",
          "MVP instead of full marketplace — validate before building everything.",
          "Admin-managed data initially — faster validation; supplier dashboards later.",
        ],
        traction: {
          pilot: "Calicut, Malappuram, Malabar region; ~50–60 agencies.",
          later: "300+ agencies; ~300–400 searches/day.",
          duration: "~1 year of operation.",
        },
        outcome:
          "300+ agencies, 300–400 searches/day, ~1 year, eventually shut down. Portfolio story = clear industry problem, understanding existing behaviour, WhatsApp-first decision, MVP strategy, fast validation, real adoption, product thinking, efficient execution.",
      },
    },
  },
  {
    title: "CapMyLead",
    slug: "capmylead",
    summary:
      "A deliberately simple, WhatsApp-workflow CRM for a travel-agent sales team. Captures leads from notifications, a half-screen popup lets reps take notes without leaving WhatsApp, and a customizable follow-up sequence surfaces who to contact each morning.",
    role: "Product Engineer (engineering & problem-solving direction; AI-assisted build)",
    org: "Travel-industry client (contract)",
    timeline: "Contract",
    tags: ["contract", "crm", "flutter", "sales", "whatsapp", "ai-assisted"],
    tech: [
      "Flutter",
      "Supabase",
      "Android notification detection",
      "Android popup/bubble",
      "APK (internal distribution)",
    ],
    featured: true,
    order: 2,
    status: "published",
    links: [],
    metadata: {
      projectType: "contract",
      aiTag: "100% AI-assisted",
      aiNote:
        "Coding/implementation done completely with AI. Nihal's contribution = understanding the problem, engineering thinking, problem-solving, deciding what to build, designing the solution/workflow, technical/product decisions, iterative direction. Do NOT represent this as traditionally hand-coded.",
      raw: {
        clientContext:
          "Client was a travel agent. Existing WhatsApp-based CRMs felt too overwhelming; they wanted something very simple the sales team would actually use and rely on.",
        problem:
          "Salespeople talk to customers via WhatsApp and calls; customers give important info mid-conversation but reps rarely record it immediately (entering into Excel during a call is inconvenient), then forget. Result: lost customer info, forgotten details, missed follow-ups, unstructured history, disorganized follow-up.",
        solution:
          "A simple CRM-like system built around the team's existing behaviour. Built in Flutter (app-side first). Captures notifications, detects phone numbers, checks if the number exists; if not, creates a contact and generates a lead id from a company prefix + phone (e.g. ZL100 + number).",
        popupBubble:
          "A popup/bubble floats above the screen; tapping opens a partial/half-screen interface that doesn't fully cover WhatsApp, so the rep keeps chatting while entering info: customer fields, name, notes, and ~15 recent contacts.",
        followUp:
          "Customizable follow-up sequences (e.g. 7 touch points, 2-day gaps). Tracks which leads need follow-up and their current touch-point. Morning: rep opens app, sees who's due and at what level, taps one button to open the right WhatsApp chat with the relevant message/data.",
        productThinking:
          "Client explicitly did NOT want an overwhelming CRM. Designed around the existing WhatsApp workflow instead of a separate CRM; popup minimizes interruption; info recorded live; structured follow-ups without complexity.",
        distribution:
          "Notification detection + popup/bubble complicate Play Store distribution. Clearly communicated this to the client; they were fine with internal APK distribution (team on Android). Avoided spending time/money on Play Store approval during the initial phase.",
        clientPreference:
          "Avoid expensive official APIs / unnecessary external tools; affordable; under their internal control. No official WhatsApp API used.",
      },
    },
  },
  {
    title: "Prime Circle",
    slug: "prime-circle",
    summary:
      "A conversion-strategy engagement for an Instagram creator's paid community. 800+ users were reaching the nas.io checkout and leaving; I added a curated Framer landing page before checkout to communicate the community's value — cutting checkout abandonment by ~33%.",
    role: "Product / Conversion Engineer (contract)",
    org: "Seven Sinan (Instagram creator) — community 'Prime Circle'",
    timeline: "Contract (ongoing / still iterating)",
    tags: ["contract", "conversion", "framer", "community", "landing-page"],
    tech: ["nas.io (community + checkout)", "Framer (landing page)"],
    featured: true,
    order: 3,
    status: "published",
    links: [],
    metadata: {
      projectType: "contract",
      stats: [
        { value: "~33%", label: "less checkout abandonment" },
        { value: "800+", label: "drop-offs analysed" },
      ],
      raw: {
        clientContext:
          "Client: Seven Sinan, an Instagram creator with a following and lifestyle-blogging experience, wanted to create a community ('Prime Circle') and needed help with the technology side.",
        initialApproach:
          "Set up nas.io for community management + checkout — use an existing platform instead of rebuilding community infrastructure.",
        problemDiscovery:
          "800+ users were reaching the nas.io page/checkout and abandoning. Investigated: users didn't understand the community well enough and were sent too directly to checkout without enough context on the value.",
        problemStatement:
          "The task was NOT 'build a website' — it was reduce checkout abandonment, improve the conversion journey, and communicate the community's value more clearly.",
        solution:
          "Built a highly curated Framer landing page (activities, community info, value proposition). Flow: land on Prime Circle page → understand community, activities & value → then go to nas.io checkout.",
        conversionStrategy:
          "Studied customer behaviour, identified why people abandoned, added an information layer before checkout, designed the page around the user's decision-making. Minimum necessary technology: don't rebuild the community (nas.io), add Framer as a conversion-focused information layer.",
        result:
          "Checkout abandonment reduced by ~33% (NOT 35%). Still being updated/optimized.",
      },
    },
  },
  {
    title: "Reputup",
    slug: "reputup",
    summary:
      "Review-management SaaS (worked at MVP stage). Built the foundation of an embeddable review-widget system — snippet-based integration that drops reviews into external sites as sections or pop-ups, staying responsive and theme-adaptable without breaking the host site.",
    role: "Frontend / Widget Engineer (contract, MVP stage)",
    org: "Reputup (contract)",
    timeline: "Contract — MVP stage",
    tags: ["contract", "saas", "widgets", "embeddable", "reviews", "mvp"],
    tech: ["JavaScript", "React (reference sample)"],
    featured: false,
    order: 4,
    status: "published",
    links: [
      {
        label: "Reference sample repo",
        url: "https://github.com/nihalavulan/widgetify-sample",
      },
    ],
    metadata: {
      projectType: "contract",
      techStackConfirmed: false,
      techStackNote:
        "Exact production tech stack NOT yet confirmed. github.com/nihalavulan/widgetify-sample is a public JavaScript / Create-React-App reference/sample only — do not treat it as the complete production stack.",
      raw: {
        product:
          "Reputup is a review-management SaaS: businesses manage reviews and display them on their own websites via different widgets.",
        stage:
          "Worked during MVP creation, on the foundation/logic behind the review-widget system and how to integrate widgets into external websites.",
        problem:
          "Businesses need to display reviews on their sites with easy integration, flexible formats, and customizable designs/themes. Technical challenge: the widget is inserted into sites I don't control — it must not break the host site and must work across layouts, screen sizes, mobile, responsive designs, themes, and different structures.",
        solution:
          "Built the basic logic for generating/displaying review widgets and integrating them into external sites, on a snippet-based model (owner pastes a code snippet). Widgets could appear as sections, pop-ups, and other formats.",
        keyTechnicalProblem:
          "An embeddable component that works inside external sites, avoids breaking/conflicting with host styling, stays responsive on mobile, and supports themes + customization.",
        ownership:
          "Initial foundation of the widget system — core logic & implementation, widget design, integration behaviour, responsive/mobile behaviour, theme/customization. Focus: how an embeddable component works reliably across different websites.",
      },
    },
  },
  {
    title: "Tradify",
    slug: "tradify",
    summary:
      "Design-to-code implementation project: converted a complex, multi-page client design (~30 pages) into production-quality HTML + Tailwind CSS with accurate fidelity to the provided UI.",
    role: "Frontend Developer (contract)",
    org: "Client (contract)",
    timeline: "Contract",
    tags: ["contract", "frontend", "html", "tailwind", "design-to-code"],
    tech: ["HTML", "Tailwind CSS"],
    featured: false,
    order: 5,
    status: "published",
    links: [],
    metadata: {
      projectType: "contract",
      stats: [{ value: "~30", label: "pages built" }],
      nameSpellingFlag:
        "Source dump said 'Correct spelling: Tradify' but also 'Spelling: T-R-A-D-I-I-F-Y' (= 'Tradiify'). Stored as 'Tradify'; NEEDS Nihal to confirm the correct spelling.",
      raw: {
        requirement:
          "Client provided a complex design with many pages. Straightforward requirement: convert the provided UI design into production-quality HTML.",
        implementation:
          "Converted the complex UI into HTML — ~30 pages — focused on accurate implementation of the provided design at production quality.",
        nature:
          "A straightforward implementation project — unlike GroupyGo / Prime Circle / CapMyLead, the problem-solving scope was more direct: translate a complex visual design into production-quality frontend code.",
      },
    },
  },
  {
    title: "Aerobix",
    slug: "aerobix",
    summary:
      "Middle-of-funnel conversion work for a Malappuram fitness clinic. Plenty of ads-driven leads, but poorly qualified — built a landing page + funnel that educates, communicates value, qualifies leads, and drives call bookings so the sales team spends time on the right leads.",
    role: "Conversion / Funnel Engineer (contract)",
    org: "Aerobix — fitness clinic, Malappuram (contract)",
    timeline: "Contract",
    tags: ["contract", "conversion", "funnel", "landing-page", "lead-gen"],
    tech: ["Landing page", "Funnel / conversion strategy"],
    featured: true,
    order: 6,
    status: "published",
    links: [],
    metadata: {
      projectType: "contract",
      raw: {
        businessContext:
          "Aerobix generates leads via ads and other marketing; a sales team handles them. The problem sat in the middle of the funnel.",
        problem:
          "Lots of leads reaching the sales team, insufficiently filtered/qualified; value proposition not communicated well; sales resources used inefficiently. Leads needed more understanding and qualification before reaching sales.",
        approach:
          "Created a landing page + a process that routes leads through it, designed to help users understand the service, value proposition, their needs, and what Aerobix provides — filtering/qualifying leads before they reach sales.",
        contentUiThinking:
          "Strong focus on the content and intent of every section; UI + content designed around the customer. The page acts as part of the sales funnel, not just a visual website.",
        conversionStrategy: [
          "Better lead qualification",
          "Better value proposition",
          "Understanding customer needs",
          "Hooking strategies",
          "Lead-magnet strategies",
          "Encouraging users to book a call",
          "Structuring the funnel before sales involvement",
        ],
        funnel:
          "Ads / lead gen → Aerobix landing page → understand value / qualify / educate → hook / lead magnet → book a call → sales team.",
        coreStory:
          "Leads already existed — the problem wasn't generating more, it was lead quality and the middle of the funnel. Built a system to qualify & educate leads and improve how sales resources are used; convert the right leads rather than just increasing volume.",
      },
    },
  },
  {
    title: "Macro Bowls",
    slug: "macro-bowls",
    summary:
      "Full-spectrum work for a high-protein healthy-food startup: Meta Ads lead generation, branding/positioning + packaging + social design, and an internal role-based Telegram bot (Telegram + n8n + Google Sheets) that made daily operations ~10x faster.",
    role: "Growth, Branding & Automation (contract)",
    org: "Macro Bowls — healthy food startup (contract)",
    timeline: "Contract",
    tags: ["contract", "meta-ads", "branding", "automation", "n8n", "telegram"],
    tech: ["Meta Ads", "n8n", "Telegram Bot API", "Google Sheets"],
    featured: false,
    order: 7,
    status: "published",
    links: [],
    metadata: {
      projectType: "contract",
      stats: [{ value: "~10x", label: "faster internal ops" }],
      collaborators: ["Shabith KMS"],
      collaboratorNote: "Credit Shabith KMS for his contribution to this project.",
      raw: {
        business: "Macro Bowls — high-protein / healthy food startup.",
        contributions: [
          "Lead generation through Meta Ads (optimizing ads for relevant leads/customers).",
          "Branding & positioning — UI, branding designs, product packaging, overall branding, social-media design.",
          "Internal operational automation — a role-based Telegram bot.",
        ],
        telegramBot: {
          built: "n8n; Google Sheets as underlying data/operations.",
          goal: "Make internal operations ~10x faster; team retrieves what they need via Telegram instead of checking multiple sources.",
          roles: {
            delivery:
              "Ask for today's delivery list → gets list + customer contact numbers + info needed for deliveries.",
            chef: "Ask for today's cooking requirements → gets quantities to prepare/cook.",
            manager:
              "Ask for current ops info → today's deliveries + financial info + today's revenue/current financials.",
          },
          system: "Telegram bot → n8n automation → Google Sheets → operational data.",
        },
        coreStory:
          "Food startup needed both customer acquisition and operational efficiency: Meta Ads for lead gen, brand identity/positioning & product presentation, and internal automation with role-based Telegram access connecting Telegram + n8n + Google Sheets so info is accessible via simple conversational commands.",
      },
    },
  },
  {
    title: "One Chat",
    slug: "one-chat",
    summary:
      "Personal project — “One Chat, Many Languages.” A chat app where each person writes in their own language and the recipient reads it in theirs, with AI doing context-aware (not word-for-word) translation in the background. Inspired by living in Dubai among people speaking many languages.",
    role: "Creator (personal project)",
    org: "Personal",
    timeline: "Personal project",
    tags: ["personal", "chat", "ai", "translation", "concept"],
    tech: ["Google translation", "AI / LLM translation"],
    featured: false,
    order: 8,
    status: "draft",
    links: [],
    metadata: {
      projectType: "personal",
      raw: {
        coreIdea: "One Chat, Many Languages.",
        problem:
          "From living in a shared flat in Dubai among friends speaking Marathi, Bengali, Persian, Arabic and more — people want to communicate but language is a barrier. A person wants to type in their own language; the other wants to read it in theirs.",
        productIdea:
          "Each person picks their preferred language, types in their own language, and the recipient receives it in theirs (e.g. Malayalam → English, Bengali → Malayalam).",
        aiTranslation:
          "Google translation + AI to make translation natural/context-aware — not word-for-word; AI understands context and produces an optimized chat response in the recipient's language. Goals: preserve meaning, natural communication, reduce language barriers.",
        philosophy:
          "One chat interface, multiple languages, each person in their own language, translation in the background, no manual translating.",
      },
    },
  },
];

// Meta-level insight about Nihal (not tied to a single project) → Profile.metadata.
const approach = {
  summary:
    "Starts from the actual problem instead of a technology; understands existing user behaviour and builds around it.",
  crossProjectPatterns: {
    groupygo: "Unorganized B2B ticket info → WhatsApp-first MVP (don't force a new app).",
    capmylead: "Reps forget customer info/follow-ups → notification capture + popup + lightweight CRM (not a complex CRM).",
    primeCircle: "Reached checkout but didn't understand the community → curated info/conversion layer (don't rebuild the platform).",
    aerobix: "Too many unqualified leads → improve mid-funnel with landing page, qualification, value comms, hooks & lead magnets.",
    macroBowls: "Needed acquisition + ops efficiency → Meta Ads + branding + Telegram/n8n/Sheets automation.",
    reputup: "Reviews must embed into different sites without breaking them → flexible embeddable snippet widgets, responsive, themed.",
    tradify: "Complex design → production frontend → ~30 pages in HTML/Tailwind.",
  },
  problemSolvingStyle: [
    "Start with the actual user/business problem",
    "Understand existing user behaviour",
    "Avoid unnecessary rebuilding; prefer existing platforms/tools when they solve part of the problem",
    "Build an MVP when validation matters more than completeness",
    "Choose technology based on the problem",
    "Reduce friction for users",
    "Think about the whole funnel/workflow, not just the UI",
    "Comfortable across frontend and backend, integrating third-party APIs, and with automation",
    "Comfortable using AI as an implementation tool",
    "Can independently own complete modules/products",
    "Work iteratively with clients",
    "Make practical trade-offs on cost, speed, user behaviour, adoption, technical limits, and business requirements",
  ],
  portfolioDirection:
    "Case studies should answer: what was the problem, who had it, how I understood it, what approach I took and why, what I built, the result, and the technical/product trade-offs — NOT just a list of technologies.",
};

async function main() {
  await connect();

  for (const exp of experiences) {
    await Experience.findOneAndUpdate(
      { org: exp.org, role: exp.role },
      exp,
      { upsert: true, setDefaultsOnInsert: true, returnDocument: "after" }
    );
    console.log(`✓ Experience: ${exp.org} — ${exp.role}`);
  }

  for (const proj of projects) {
    await Project.findOneAndUpdate({ slug: proj.slug }, proj, {
      upsert: true,
      setDefaultsOnInsert: true,
      returnDocument: "after",
    });
    console.log(`✓ Project: ${proj.title}`);
  }

  await Profile.findOneAndUpdate(
    {},
    { $set: { "metadata.approach": approach } },
    { returnDocument: "after" }
  );
  console.log("✓ Profile: attached problem-solving approach + patterns");

  await disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
